import { Router } from 'express';
import aiRoutes from './ai.routes.js';
import analyticsRoutes from './analytics.routes.js';
import authRoutes from './auth.routes.js';
import campaignRoutes from './campaign.routes.js';
import reportRoutes from './report.routes.js';
import assistantRoutes from './assistant.routes.js';
import medicineRoutes from './medicine.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/ai', aiRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/campaigns', campaignRoutes);
router.use('/reports', reportRoutes);
router.use('/assistant', assistantRoutes);
router.use('/medicine', medicineRoutes);

export default router;

