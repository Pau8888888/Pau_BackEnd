const express = require('express');
const routerUsuari = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Gestión de usuarios
 */

/**
 * @swagger
 * /api/usuaris/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario creado
 */
routerUsuari.post('/register', userController.registrar);

/**
 * @swagger
 * /api/usuaris/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login correcto
 */
routerUsuari.post('/login', userController.login);

/**
 * @swagger
 * /api/usuaris/logout:
 *   post:
 *     summary: Cerrar sesión
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Sesión cerrada
 */
routerUsuari.post('/logout', userController.logout);

/**
 * @swagger
 * /api/usuaris/refresh:
 *   post:
 *     summary: Refrescar token
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Token refrescado
 */
routerUsuari.post('/refresh', userController.refreshToken);

/**
 * @swagger
 * /api/usuaris/password/{id}:
 *   put:
 *     summary: Actualizar contraseña por ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contraseña actualizada
 */
routerUsuari.put('/password/:id', authMiddleware, userController.actualizarContrasenya);

module.exports = routerUsuari;
