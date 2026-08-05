import { Router } from 'express';
import {
  getGeoHeatmap,
  getOutbreakAnomalies,
  getKnowledgeGraph,
  getNews,
  simulateScenario,
  simulateDigitalTwin,
  getResourceInventory,
  getSavedScenarios,
  saveScenario,
  deleteScenario,
} from '../controllers/analyticsController.js';

const router = Router();

router.get('/heatmap', getGeoHeatmap);
router.get('/anomalies', getOutbreakAnomalies);
router.get('/knowledge-graph', getKnowledgeGraph);
router.get('/news', getNews);
router.get('/resources', getResourceInventory);
router.post('/simulate', simulateScenario);
router.post('/digital-twin', simulateDigitalTwin);

// Scenario history routes
router.get('/scenarios', getSavedScenarios);
router.post('/scenarios', saveScenario);
router.delete('/scenarios/:id', deleteScenario);

export default router;
