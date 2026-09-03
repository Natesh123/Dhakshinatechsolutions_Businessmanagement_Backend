"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNote = exports.updateNote = exports.createNote = exports.getNote = exports.getNotes = void 0;
const Note_1 = require("../models/Note");
// Get all notes
const getNotes = async (req, res) => {
    try {
        const notes = await Note_1.Note.findAll({
            order: [['updatedAt', 'DESC']]
        });
        res.json({ success: true, data: notes });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getNotes = getNotes;
// Get single note
const getNote = async (req, res) => {
    try {
        const note = await Note_1.Note.findByPk(req.params.id);
        if (!note) {
            res.status(404).json({ success: false, message: 'Note not found' });
            return;
        }
        res.json({ success: true, data: note });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getNote = getNote;
// Create a note
const createNote = async (req, res) => {
    try {
        const { title, content, relatedTo } = req.body;
        const newNote = await Note_1.Note.create({ title, content, relatedTo });
        res.status(201).json({ success: true, data: newNote, message: 'Note created successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.createNote = createNote;
// Update a note
const updateNote = async (req, res) => {
    try {
        const { title, content, relatedTo } = req.body;
        const note = await Note_1.Note.findByPk(req.params.id);
        if (!note) {
            res.status(404).json({ success: false, message: 'Note not found' });
            return;
        }
        await note.update({ title, content, relatedTo });
        res.json({ success: true, data: note, message: 'Note updated successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateNote = updateNote;
// Delete a note
const deleteNote = async (req, res) => {
    try {
        const note = await Note_1.Note.findByPk(req.params.id);
        if (!note) {
            res.status(404).json({ success: false, message: 'Note not found' });
            return;
        }
        await note.destroy();
        res.json({ success: true, message: 'Note deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.deleteNote = deleteNote;
