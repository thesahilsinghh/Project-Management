import { validationResult } from 'express-validator';
import { loginUserService, registerUserService } from "../services/authService.js";

export const registerUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        const data = await registerUserService(email, password);
        res.status(201).json({
            token: data.token,
            user: { id: data.user._id, email: data.user.email }
        });
    } catch (error) {
        console.error(error);
        if (error.message === 'User already exists') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

export const loginUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;
        const data = await loginUserService(email, password);

        res.cookie("token", data.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "none",
            maxAge: 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            token: data.token,
            user: { id: data.user._id, email: data.user.email }
        });
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};

export const getMe = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            user: req.user
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};