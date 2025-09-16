import express from 'express';
import { body } from 'express-validator';
import auth from '../middleware/auth.js';
import {
    getAllProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject
} from '../controller/projectController.js';

const router = express.Router();

router.get('/', auth, getAllProjects);

router.get('/:id', auth, getProjectById);

router.post('/', [
    auth,
    body('title').trim().isLength({ min: 1 }).withMessage('Title is required'),
    body('description').optional().trim()
], createProject);

router.put('/:id', [
    auth,
    body('title').trim().isLength({ min: 1 }).withMessage('Title is required'),
    body('description').optional().trim()
], updateProject);

router.delete('/:id', auth, deleteProject);

export default router;
