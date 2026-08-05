import { Router } from 'express';
import { handleLogin, getCurrentUser } from '../controllers/authController.js';

const router = Router();

router.post('/login', handleLogin);
router.get('/me', getCurrentUser);

export default router;
