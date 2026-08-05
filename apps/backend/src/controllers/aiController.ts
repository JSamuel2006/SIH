import { Request, Response, NextFunction } from 'express';
import { piiRedactor } from '../services/ai-services/piiRedactor.js';
import { ragService } from '../services/ai-services/ragService.js';
import { bhashiniService } from '../services/ai-services/bhashiniService.js';

export async function handleTriageQuery(req: Request, res: Response, next: NextFunction) {
  try {
    const { query, language = 'hi', geoHash } = req.body;

    if (!query) {
      return res.status(400).json({ success: false, message: 'Query string is required.' });
    }

    const englishQuery = language !== 'en' 
      ? await bhashiniService.translateText(query, language, 'en') 
      : query;

    const sanitizedQuery = piiRedactor.stripPII(englishQuery);
    const triageResult = await ragService.processQuery(sanitizedQuery, geoHash);

    const localizedAnswer = language !== 'en'
      ? await bhashiniService.translateText(triageResult.answer, 'en', language)
      : triageResult.answer;

    return res.status(200).json({
      success: true,
      data: {
        query: localizedAnswer,
        disclaimer: 'This AI triage tool provides health education based on ICMR/WHO guidelines and is NOT a medical prescription. Consult a Registered Medical Practitioner for diagnosis.',
        sources: triageResult.sources,
        emergencyEscalation: triageResult.isEmergency,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function handleTranslate(req: Request, res: Response, next: NextFunction) {
  try {
    const { text, sourceLang, targetLang } = req.body;
    const translated = await bhashiniService.translateText(text, sourceLang, targetLang);
    return res.status(200).json({ success: true, data: { translatedText: translated } });
  } catch (error) {
    next(error);
  }
}

export async function handleScanMedicine(req: Request, res: Response, next: NextFunction) {
  try {
    // Simulates AI OCR medicine strip scanning
    return res.status(200).json({
      success: true,
      data: {
        name: 'Paracetamol 500mg',
        uses: 'Used to treat mild-to-moderate pain and reduce fever.',
        precautions: [
          'Do not exceed maximum daily dose.',
          'Avoid severe alcohol consumption.',
        ],
        sideEffects: ['Liver toxicity (rare/only with high doses)'],
        storage: 'Store below 30°C in a dry place.',
        childSafety: 'Consult pediatrician for children under 12.',
        pregnancyWarning: 'Considered safe for short-term use under advice.',
        dosageGuidance: 'Adults: 1-2 tablets every 4-6 hours as needed.',
        confidence: 0.94,
        sources: ['Indian Pharmacopoeia (IP)'],
      },
    });
  } catch (error) {
    next(error);
  }
}
