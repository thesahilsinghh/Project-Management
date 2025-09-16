import jwt from 'jsonwebtoken';
import User from "../models/User.js";

// Generate JWT token
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

export const registerUserService = async (email, password) => {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error('User already exists');
    }

    // Create new user
    const user = new User({ email, password });
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    return { token, user };
};

export const loginUserService = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Invalid credentials');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }

    // Generate token
    const token = generateToken(user._id);

    return { token, user };
};