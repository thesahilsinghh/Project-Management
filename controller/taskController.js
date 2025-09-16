import { validationResult } from 'express-validator';
import {
    getAllTasksService,
    getTaskByIdService,
    createTaskService,
    updateTaskService,
    deleteTaskService
} from '../services/taskService.js';

export const getAllTasks = async (req, res) => {
    try {
        const { project, status, sortBy, sortOrder } = req.query;
        const filters = { project, status, sortBy, sortOrder };
        const tasks = await getAllTasksService(req.user._id, filters);
        res.json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getTaskById = async (req, res) => {
    try {
        const task = await getTaskByIdService(req.params.id, req.user._id);
        res.json(task);
    } catch (error) {
        if (error.message === 'Task not found') {
            return res.status(404).json({ message: error.message });
        }
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const createTask = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, description, status, dueDate, project } = req.body;
        const taskData = { title, description, status, dueDate, project };

        const task = await createTaskService(taskData, req.user._id);
        res.status(201).json(task);
    } catch (error) {
        if (error.message === 'Project not found') {
            return res.status(404).json({ message: error.message });
        }
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateTask = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, description, status, dueDate } = req.body;
        const taskData = { title, description, status, dueDate };

        const task = await updateTaskService(req.params.id, taskData, req.user._id);
        res.json(task);
    } catch (error) {
        if (error.message === 'Task not found') {
            return res.status(404).json({ message: error.message });
        }
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const result = await deleteTaskService(req.params.id, req.user._id);
        res.json(result);
    } catch (error) {
        if (error.message === 'Task not found') {
            return res.status(404).json({ message: error.message });
        }
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
