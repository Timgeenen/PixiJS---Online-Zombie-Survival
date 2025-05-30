import { createLobby } from '@Controllers/lobbyController';
import authMiddleware from '@Middleware/authMiddleware';
import { Router } from 'express';

const router = Router();

router.use(authMiddleware);

router.post('/create', createLobby);

export default router;
