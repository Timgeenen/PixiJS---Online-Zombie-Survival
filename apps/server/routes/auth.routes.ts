import { Router } from "express";
const { login, validateToken } = require('@Controllers/authController');

const router = Router();

router.post('/login', login);
router.get('/validate', validateToken);

export default router