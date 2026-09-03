"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const clientController_1 = require("../controllers/clientController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticateJWT); // Protect all client routes
router.get('/', clientController_1.getClients);
router.get('/:id', clientController_1.getClientById);
router.post('/', clientController_1.createClient);
router.put('/:id', clientController_1.updateClient);
router.delete('/:id', clientController_1.deleteClient);
exports.default = router;
