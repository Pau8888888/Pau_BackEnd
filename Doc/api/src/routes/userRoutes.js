const express = require('express');
const routerUsuari = express.Router();
const userController = require('../controllers/userController');

// 🔹 Rutes d'usuari
routerUsuari.post('/register', userController.registrar);
routerUsuari.post('/login', userController.login);
routerUsuari.post('/logout', userController.logout);
routerUsuari.post('/refresh', userController.refreshToken);

// 🔹 Actualizar contraseña por id
routerUsuari.put('/password/:id', userController.actualizarContrasenya);

module.exports = routerUsuari;
