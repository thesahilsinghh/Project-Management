import express from 'express';
import { body } from 'express-validator';
import auth from '../middleware/auth.js';
import {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
} from '../controller/taskController.js';

const router = express.Router();

router.get('/', auth, getAllTasks);

router.get('/:id', auth, getTaskById);

router.post('/', [
    auth,
    body('title').trim().isLength({ min: 1 }).withMessage('Title is required'),
    body('description').optional().trim(),
    body('status').optional().isIn(['todo', 'in-progress', 'done']),
    body('dueDate').optional().isISO8601(),
    body('project').isMongoId().withMessage('Valid project ID is required')
], createTask);

router.put('/:id', [
    auth,
    body('title').trim().isLength({ min: 1 }).withMessage('Title is required'),
    body('description').optional().trim(),
    body('status').optional().isIn(['todo', 'in-progress', 'done']),
    body('dueDate').optional().isISO8601()
], updateTask);

router.delete('/:id', auth, deleteTask);

export default router;
