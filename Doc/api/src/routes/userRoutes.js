const express = require('express');
const routerUsuari = express.Router();
const userController = require('../controllers/userController');

// 🔹 Rutes per registre i login
routerUsuari.post('/register', userController.registrar);
routerUsuari.post('/login', userController.login);

module.exports = routerUsuari;
