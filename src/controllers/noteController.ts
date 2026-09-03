import { Request, Response } from 'express';
import { Note } from '../models/Note';

// Get all notes
export const getNotes = async (req: Request, res: Response): Promise<void> => {
  try {
    const notes = await Note.findAll({
      order: [['updatedAt', 'DESC']]
    });
    res.json({ success: true, data: notes });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single note
export const getNote = async (req: Request, res: Response): Promise<void> => {
  try {
    const note = await Note.findByPk(req.params.id as string);
    if (!note) {
      res.status(404).json({ success: false, message: 'Note not found' });
      return;
    }
    res.json({ success: true, data: note });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create a note
export const createNote = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, content, relatedTo } = req.body;
    const newNote = await Note.create({ title, content, relatedTo });
    res.status(201).json({ success: true, data: newNote, message: 'Note created successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a note
export const updateNote = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, content, relatedTo } = req.body;
    const note = await Note.findByPk(req.params.id as string);
    
    if (!note) {
      res.status(404).json({ success: false, message: 'Note not found' });
      return;
    }

    await note.update({ title, content, relatedTo });
    res.json({ success: true, data: note, message: 'Note updated successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a note
export const deleteNote = async (req: Request, res: Response): Promise<void> => {
  try {
    const note = await Note.findByPk(req.params.id as string);
    
    if (!note) {
      res.status(404).json({ success: false, message: 'Note not found' });
      return;
    }

    await note.destroy();
    res.json({ success: true, message: 'Note deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
