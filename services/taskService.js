import Task from '../models/Task.js';
import Project from '../models/Project.js';

export const getAllTasksService = async (userId, filters = {}) => {
    const { project, status, sortBy = 'createdAt', sortOrder = 'desc' } = filters;

    let query = { user: userId };

    if (project) {
        query.project = project;
    }

    if (status) {
        query.status = status;
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const tasks = await Task.find(query)
        .populate('project', 'title')
        .sort(sortOptions);

    return tasks;
};

export const getTaskByIdService = async (taskId, userId) => {
    const task = await Task.findOne({
        _id: taskId,
        user: userId
    }).populate('project', 'title');

    if (!task) {
        throw new Error('Task not found');
    }

    return task;
};

export const createTaskService = async (taskData, userId) => {
    const { title, description, status = 'todo', dueDate, project } = taskData;

    // Verify project belongs to user
    const projectExists = await Project.findOne({
        _id: project,
        user: userId
    });

    if (!projectExists) {
        throw new Error('Project not found');
    }

    const task = new Task({
        title,
        description,
        status,
        dueDate: dueDate ? new Date(dueDate) : null,
        project,
        user: userId
    });

    await task.save();
    await task.populate('project', 'title');
    return task;
};

export const updateTaskService = async (taskId, taskData, userId) => {
    const { title, description, status, dueDate } = taskData;

    const updateData = { title, description, status };
    if (dueDate) {
        updateData.dueDate = new Date(dueDate);
    }

    const task = await Task.findOneAndUpdate(
        { _id: taskId, user: userId },
        updateData,
        { new: true }
    ).populate('project', 'title');

    if (!task) {
        throw new Error('Task not found');
    }

    return task;
};

export const deleteTaskService = async (taskId, userId) => {
    const task = await Task.findOneAndDelete({
        _id: taskId,
        user: userId
    });

    if (!task) {
        throw new Error('Task not found');
    }

    return { message: 'Task deleted successfully' };
};
