import { guestLogin, login, register } from '@Controllers/authController';
import authMiddleware from '@Middleware/authMiddleware';
import { Router } from 'express';

const router = Router();

router.post('/login', login);
router.post('/register', register);

router.get('/guest', authMiddleware, guestLogin);

export default router;
