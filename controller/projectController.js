import { validationResult } from 'express-validator';
import {
    getAllProjectsService,
    getProjectByIdService,
    createProjectService,
    updateProjectService,
    deleteProjectService
} from '../services/projectService.js';

export const getAllProjects = async (req, res) => {
    try {
        const projects = await getAllProjectsService(req.user._id);
        res.json(projects);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getProjectById = async (req, res) => {
    try {
        const project = await getProjectByIdService(req.params.id, req.user._id);
        res.json(project);
    } catch (error) {
        if (error.message === 'Project not found') {
            return res.status(404).json({ message: error.message });
        }
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const createProject = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, description } = req.body;
        const project = await createProjectService(title, description, req.user._id);
        res.status(201).json(project);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateProject = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, description } = req.body;
        const project = await updateProjectService(req.params.id, title, description, req.user._id);
        res.json(project);
    } catch (error) {
        if (error.message === 'Project not found') {
            return res.status(404).json({ message: error.message });
        }
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteProject = async (req, res) => {
    try {
        const result = await deleteProjectService(req.params.id, req.user._id);
        res.json(result);
    } catch (error) {
        if (error.message === 'Project not found') {
            return res.status(404).json({ message: error.message });
        }
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
