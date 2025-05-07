import { Router } from 'express';
const { login, validateToken, register, guestLogin } = require('@Controllers/authController');

const router = Router();

router.post('/login', login);
router.post('/register', register)

router.get('/guest', guestLogin);
router.get('/validate', validateToken);

export default router;
