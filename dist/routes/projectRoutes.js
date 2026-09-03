"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const projectController_1 = require("../controllers/projectController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticateJWT);
router.get('/', projectController_1.getProjects);
router.get('/:id', projectController_1.getProjectById);
router.post('/', projectController_1.createProject);
router.put('/:id', projectController_1.updateProject);
router.delete('/:id', projectController_1.deleteProject);
// Note routes
router.get('/notes/all', projectController_1.getAllProjectNotes);
router.get('/:id/notes', projectController_1.getProjectNotes);
router.post('/:id/notes', projectController_1.createProjectNote);
router.delete('/notes/:noteId', projectController_1.deleteProjectNote);
exports.default = router;
