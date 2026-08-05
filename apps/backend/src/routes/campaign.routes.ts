import { Router } from 'express';
import { getCampaigns, createCampaign, generateCampaignContent } from '../controllers/campaignController.js';

const router = Router();

router.get('/', getCampaigns);
router.post('/', createCampaign);
router.post('/generate', generateCampaignContent);

export default router;
