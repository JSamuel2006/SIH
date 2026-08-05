import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import { ocrService } from '../services/ocr/ocrService.js';
import { geminiService } from '../services/ai-services/geminiService.js';
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [new winston.transports.Console()]
});

// Simple in-memory cache for repeating medicine lookups
const medicineCache = new Map<string, any>();

// Simple IP-based rate limiter map: IP -> timestamp[]
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const MAX_REQUESTS_PER_MINUTE = 15;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  
  // Filter out timestamps older than window
  const activeTimestamps = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
  
  if (activeTimestamps.length >= MAX_REQUESTS_PER_MINUTE) {
    return false;
  }
  
  activeTimestamps.push(now);
  rateLimitMap.set(ip, activeTimestamps);
  return true;
}

export async function handleAnalyzeMedicine(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip || 'unknown';
  
  if (!checkRateLimit(ip)) {
    if (req.file && fs.existsSync(req.file.path)) {
      try { fs.unlinkSync(req.file.path); } catch (e) {}
    }
    return res.status(429).json({
      success: false,
      message: 'Too many requests. Please wait a minute and try again.'
    });
  }

  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No medicine strip image was uploaded.'
    });
  }

  const filePath = req.file.path;

  try {
    logger.info({ message: 'Starting OCR analysis', file: req.file.filename });
    
    // 1. Perform OCR
    let ocrResult;
    try {
      ocrResult = await ocrService.recognize(filePath);
    } catch (ocrError: any) {
      if (ocrError.message?.includes('Image quality is too low')) {
        return res.status(422).json({
          success: false,
          message: 'Image quality is too low. Please capture a clearer image.'
        });
      }
      throw ocrError;
    }

    if (!ocrResult.text || ocrResult.text.trim().length === 0) {
      return res.status(422).json({
        success: false,
        message: 'No recognizable text could be extracted from the image. Please capture a clearer image.'
      });
    }

    const cleanedText = ocrResult.text;

    // 2. Cache check
    const cacheKey = cleanedText.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (medicineCache.has(cacheKey)) {
      logger.info({ message: 'Cache hit for medicine OCR text' });
      // Delete temporary file
      try { fs.unlinkSync(filePath); } catch (e) {}
      return res.status(200).json({
        success: true,
        data: medicineCache.get(cacheKey),
        ocr: {
          detectedText: cleanedText,
          confidence: ocrResult.confidence,
          cached: true
        }
      });
    }

    // 3. Connect to Gemini Service
    const systemPrompt = `You are an AI Healthcare Assistant.
The following text has been extracted from a medicine strip using OCR.
Carefully identify the medicine.
Return ONLY factual information.
Never hallucinate.
If confidence is insufficient, explicitly say "Medicine cannot be identified."

You must return a valid, well-formed JSON object ONLY. Do not wrap it in markdown code blocks or add prefix/suffix text.
JSON structure must match:
{
  "medicineName": "string",
  "genericName": "string",
  "manufacturer": "string",
  "strength": "string",
  "medicineCategory": "string",
  "prescriptionRequired": boolean,
  "uses": "string",
  "dosage": "string",
  "administrationMethod": "string",
  "sideEffects": ["string"],
  "warnings": ["string"],
  "pregnancySafety": "string",
  "breastfeedingSafety": "string",
  "childrenSafety": "string",
  "elderlySafety": "string",
  "drugInteractions": ["string"],
  "foodInteractions": ["string"],
  "storageInstructions": "string",
  "expiryGuidance": "string",
  "emergencyWarnings": "string",
  "confidenceScore": number,
  "medicalDisclaimer": "string"
}`;

    const userPrompt = `Extracted OCR Text:\n"${cleanedText}"`;

    logger.info({ message: 'Sending OCR text to Gemini', text: cleanedText });
    
    // Call Gemini (30 seconds timeout for complex parsing)
    const geminiResponseText = await geminiService.generateText(userPrompt, systemPrompt, 30000);
    
    // Remove potential markdown wrappers like ```json ... ```
    let cleanJsonStr = geminiResponseText.trim();
    if (cleanJsonStr.startsWith('```')) {
      cleanJsonStr = cleanJsonStr.replace(/^```(json)?/, '').replace(/```$/, '').trim();
    }

    let parsedResult;
    try {
      parsedResult = JSON.parse(cleanJsonStr);
    } catch (jsonErr) {
      logger.error({ message: 'Failed to parse Gemini JSON output', output: geminiResponseText });
      throw new Error('AI analysis produced invalid output. Please retry.');
    }

    // Populate cache
    medicineCache.set(cacheKey, parsedResult);

    // Clean up temporary image
    try { fs.unlinkSync(filePath); } catch (e) {}

    return res.status(200).json({
      success: true,
      data: parsedResult,
      ocr: {
        detectedText: cleanedText,
        confidence: ocrResult.confidence,
        cached: false
      }
    });

  } catch (error: any) {
    // Make sure we clean up the file in case of any failures
    if (fs.existsSync(filePath)) {
      try { fs.unlinkSync(filePath); } catch (e) {}
    }
    logger.error({ message: 'Medicine analysis failed', error: error.message });
    return res.status(500).json({
      success: false,
      message: error.message || 'An internal server error occurred while processing the image.'
    });
  }
}
