import { Router } from 'express';
import { handleAnalyzeMedicine } from '../controllers/medicineController.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = Router();

// POST /api/v1/medicine/analyze - OCR + Gemini analysis
router.post('/analyze', upload.single('image'), handleAnalyzeMedicine);

export default router;
