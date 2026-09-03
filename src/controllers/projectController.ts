// @ts-nocheck
import { Request, Response } from 'express';
import { Project } from '../models/Project';
import { Client } from '../models/Client';
import { ProjectNote } from '../models/ProjectNote';

export const getProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const projects = await Project.findAll({
      include: [{ model: Client, as: 'client', attributes: ['clientName', 'companyName'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', errors: [error] });
  }
};

export const getProjectById = async (req: Request, res: Response): Promise<void> => {
  try {
    const project = await Project.findByPk(req.params.id, {
      include: [{ model: Client, as: 'client' }]
    });
    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found' });
      return;
    }
    res.json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', errors: [error] });
  }
};

export const createProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json({ success: true, message: 'Project created successfully', data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', errors: [error] });
  }
};

export const updateProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found' });
      return;
    }
    await project.update(req.body);
    res.json({ success: true, message: 'Project updated successfully', data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', errors: [error] });
  }
};

export const deleteProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found' });
      return;
    }
    await project.destroy();
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', errors: [error] });
  }
};

export const getProjectNotes = async (req: Request, res: Response): Promise<void> => {
  try {
    const notes = await ProjectNote.findAll({
      where: { projectId: req.params.id },
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, data: notes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', errors: [error] });
  }
};

export const createProjectNote = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, content } = req.body;
    const note = await ProjectNote.create({
      projectId: parseInt(req.params.id),
      title,
      content
    });
    res.status(201).json({ success: true, message: 'Note created successfully', data: note });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', errors: [error] });
  }
};

export const deleteProjectNote = async (req: Request, res: Response): Promise<void> => {
  try {
    const note = await ProjectNote.findByPk(req.params.noteId);
    if (!note) {
      res.status(404).json({ success: false, message: 'Note not found' });
      return;
    }
    await note.destroy();
    res.json({ success: true, message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', errors: [error] });
  }
};

export const getAllProjectNotes = async (req: Request, res: Response): Promise<void> => {
  try {
    const notes = await ProjectNote.findAll({
      include: [{ model: Project, as: 'project', attributes: ['projectName'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, data: notes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', errors: [error] });
  }
};
