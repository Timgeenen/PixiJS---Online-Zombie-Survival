import { Router } from 'express';
import authRoutes from './auth.routes';
import lobbyRoutes from './lobby.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/lobby', lobbyRoutes);

export default router;
