import Project from '../models/Project.js';

export const getAllProjectsService = async (userId) => {
    const projects = await Project.find({ user: userId }).sort({ createdAt: -1 });
    return projects;
};

export const getProjectByIdService = async (projectId, userId) => {
    const project = await Project.findOne({
        _id: projectId,
        user: userId
    });

    if (!project) {
        throw new Error('Project not found');
    }

    return project;
};

export const createProjectService = async (title, description, userId) => {
    const project = new Project({
        title,
        description,
        user: userId
    });

    await project.save();
    return project;
};

export const updateProjectService = async (projectId, title, description, userId) => {
    const project = await Project.findOneAndUpdate(
        { _id: projectId, user: userId },
        { title, description },
        { new: true }
    );

    if (!project) {
        throw new Error('Project not found');
    }

    return project;
};

export const deleteProjectService = async (projectId, userId) => {
    const project = await Project.findOneAndDelete({
        _id: projectId,
        user: userId
    });

    if (!project) {
        throw new Error('Project not found');
    }

    return { message: 'Project deleted successfully' };
};
