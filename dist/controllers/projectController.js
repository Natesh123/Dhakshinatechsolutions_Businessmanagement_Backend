"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllProjectNotes = exports.deleteProjectNote = exports.createProjectNote = exports.getProjectNotes = exports.deleteProject = exports.updateProject = exports.createProject = exports.getProjectById = exports.getProjects = void 0;
const Project_1 = require("../models/Project");
const Client_1 = require("../models/Client");
const ProjectNote_1 = require("../models/ProjectNote");
const getProjects = async (req, res) => {
    try {
        const projects = await Project_1.Project.findAll({
            include: [{ model: Client_1.Client, as: 'client', attributes: ['clientName', 'companyName'] }],
            order: [['createdAt', 'DESC']]
        });
        res.json({ success: true, data: projects });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', errors: [error] });
    }
};
exports.getProjects = getProjects;
const getProjectById = async (req, res) => {
    try {
        const project = await Project_1.Project.findByPk(req.params.id, {
            include: [{ model: Client_1.Client, as: 'client' }]
        });
        if (!project) {
            res.status(404).json({ success: false, message: 'Project not found' });
            return;
        }
        res.json({ success: true, data: project });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', errors: [error] });
    }
};
exports.getProjectById = getProjectById;
const createProject = async (req, res) => {
    try {
        const project = await Project_1.Project.create(req.body);
        res.status(201).json({ success: true, message: 'Project created successfully', data: project });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', errors: [error] });
    }
};
exports.createProject = createProject;
const updateProject = async (req, res) => {
    try {
        const project = await Project_1.Project.findByPk(req.params.id);
        if (!project) {
            res.status(404).json({ success: false, message: 'Project not found' });
            return;
        }
        await project.update(req.body);
        res.json({ success: true, message: 'Project updated successfully', data: project });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', errors: [error] });
    }
};
exports.updateProject = updateProject;
const deleteProject = async (req, res) => {
    try {
        const project = await Project_1.Project.findByPk(req.params.id);
        if (!project) {
            res.status(404).json({ success: false, message: 'Project not found' });
            return;
        }
        await project.destroy();
        res.json({ success: true, message: 'Project deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', errors: [error] });
    }
};
exports.deleteProject = deleteProject;
const getProjectNotes = async (req, res) => {
    try {
        const notes = await ProjectNote_1.ProjectNote.findAll({
            where: { projectId: req.params.id },
            order: [['createdAt', 'DESC']]
        });
        res.json({ success: true, data: notes });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', errors: [error] });
    }
};
exports.getProjectNotes = getProjectNotes;
const createProjectNote = async (req, res) => {
    try {
        const { title, content } = req.body;
        const note = await ProjectNote_1.ProjectNote.create({
            projectId: parseInt(req.params.id),
            title,
            content
        });
        res.status(201).json({ success: true, message: 'Note created successfully', data: note });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', errors: [error] });
    }
};
exports.createProjectNote = createProjectNote;
const deleteProjectNote = async (req, res) => {
    try {
        const note = await ProjectNote_1.ProjectNote.findByPk(req.params.noteId);
        if (!note) {
            res.status(404).json({ success: false, message: 'Note not found' });
            return;
        }
        await note.destroy();
        res.json({ success: true, message: 'Note deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', errors: [error] });
    }
};
exports.deleteProjectNote = deleteProjectNote;
const getAllProjectNotes = async (req, res) => {
    try {
        const notes = await ProjectNote_1.ProjectNote.findAll({
            include: [{ model: Project_1.Project, as: 'project', attributes: ['projectName'] }],
            order: [['createdAt', 'DESC']]
        });
        res.json({ success: true, data: notes });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', errors: [error] });
    }
};
exports.getAllProjectNotes = getAllProjectNotes;
