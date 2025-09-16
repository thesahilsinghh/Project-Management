import express from 'express';
import { body } from 'express-validator';
import auth from '../middleware/auth.js';
import { registerUser, loginUser, getMe } from '../controller/authController.js';

const router = express.Router();

router.post('/register', [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 })
], registerUser);

router.post('/login', [
    body('email').isEmail().normalizeEmail(),
    body('password').exists()
], loginUser);

router.get('/me', auth, getMe);

export default router;
