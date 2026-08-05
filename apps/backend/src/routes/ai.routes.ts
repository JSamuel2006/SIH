import { Router } from 'express';
import { handleTriageQuery, handleTranslate } from '../controllers/aiController.js';
import { handleAnalyzeMedicine } from '../controllers/medicineController.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = Router();

// POST /api/v1/ai/triage - Process multi-lingual symptom triage query
router.post('/triage', handleTriageQuery);

// POST /api/v1/ai/translate - Indic Bhashini voice/text translation proxy
router.post('/translate', handleTranslate);

// POST /api/v1/ai/scan-medicine - AI OCR medicine strip scanner (Backward compatible)
router.post('/scan-medicine', upload.single('image'), handleAnalyzeMedicine);

export default router;

