import { authorizeUser, guestLogin, login, logout, register } from '@Controllers/authController';
import authMiddleware from '@Middleware/authMiddleware';
import { Router } from 'express';

const router = Router();

router.post('/login', login);
router.post('/register', register);

router.get('/guest', guestLogin);
router.get('/logout', logout);

router.get('/authorize', authMiddleware, authorizeUser);

export default router;
