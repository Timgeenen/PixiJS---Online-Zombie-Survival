import { createNewLobby } from '@Controllers/lobbyController';
import authMiddleware from '@Middleware/authMiddleware';
import { Router } from 'express';

const router = Router();

router.use(authMiddleware);

router.post('/create', createNewLobby);

export default router;
