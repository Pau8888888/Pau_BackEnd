const express = require('express');
const routerUsuari = express.Router();
const userController = require('../controllers/userController');

/**
 * @swagger
 * /api/usuaris/register:
 *   post:
 *     summary: Registrar un nou usuari
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuari creat
 */
routerUsuari.post('/register', userController.registrar);

/**
 * @swagger
 * /api/usuaris/login:
 *   post:
 *     summary: Iniciar sessió
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
 *         description: Login correcte
 */
routerUsuari.post('/login', userController.login);

/**
 * @swagger
 * /api/usuaris/logout:
 *   post:
 *     summary: Tancar sessió
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Sessió tancada
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
 *         description: Token refrescat
 */
routerUsuari.post('/refresh', userController.refreshToken);

/**
 * @swagger
 * /api/usuaris/password/{id}:
 *   put:
 *     summary: Actualitzar contrasenya per ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'usuari
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
 *         description: Contrasenya actualitzada
 */
routerUsuari.put('/password/:id', userController.actualizarContrasenya);

module.exports = routerUsuari;
