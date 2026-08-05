import { createWorker } from 'tesseract.js';
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [new winston.transports.Console()]
});

export interface OCRResult {
  text: string;
  confidence: number;
  processingTimeMs: number;
  language: string;
}

export class OCRService {
  private worker: any = null;

  /**
   * Cleans OCR text:
   * - Trims whitespace
   * - Removes duplicate words (consecutive or within close proximity)
   * - Fixes simple OCR noise (special character runs, weird artifacts)
   * - Normalizes text
   */
  public cleanText(rawText: string): string {
    if (!rawText) return '';

    // 1. Normalize line endings and trim lines
    let text = rawText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n');

    // 2. Remove weird OCR noise (e.g. random strings of symbols like ~~~, ===, |||)
    text = text.replace(/[~=+|<>`\\#@_]{2,}/g, ' ');

    // 3. Normalize multiple spaces/tabs to a single space
    text = text.replace(/[ \t]+/g, ' ');

    // 4. Remove duplicate words (case-insensitive consecutive duplicate words)
    // e.g. "tablet tablet" -> "tablet"
    text = text.replace(/\b(\w+)\s+\1\b/gi, '$1');

    return text.trim();
  }

  /**
   * Performs OCR on an image buffer or file path.
   */
  public async recognize(imageInput: Buffer | string): Promise<OCRResult> {
    const startTime = performance.now();
    let workerInstance = this.worker;

    try {
      if (!workerInstance) {
        logger.info({ message: 'Initializing Tesseract worker' });
        workerInstance = await createWorker('eng');
        this.worker = workerInstance;
      }

      logger.info({ message: 'Starting OCR processing' });
      const { data } = await workerInstance.recognize(imageInput);

      const processingTimeMs = Math.round(performance.now() - startTime);
      const confidence = data.confidence; // 0 to 100

      logger.info({
        message: 'OCR processing completed',
        confidence,
        processingTimeMs,
        textLength: data.text?.length || 0
      });

      const cleanedText = this.cleanText(data.text || '');

      // If confidence score is below 70%, throw error
      if (confidence < 70) {
        throw new Error('Image quality is too low. Please capture a clearer image.');
      }

      return {
        text: cleanedText,
        confidence: confidence / 100, // normalized to 0.0 - 1.0
        processingTimeMs,
        language: 'eng'
      };
    } catch (error: any) {
      logger.error({ message: 'OCR recognition failed', error: error.message });
      throw error;
    }
  }

  /**
   * Terminate active worker to release resources.
   */
  public async terminate(): Promise<void> {
    if (this.worker) {
      await this.worker.terminate();
      this.worker = null;
      logger.info({ message: 'Tesseract worker terminated' });
    }
  }
}

export const ocrService = new OCRService();
