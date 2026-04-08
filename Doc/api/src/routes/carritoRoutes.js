const express = require('express');
const router = express.Router();
const carritoController = require('../controllers/carritoController');

/**
 * @swagger
 * tags:
 *   name: Carrito
 *   description: Gestión del carrito de compras
 */

/**
 * @swagger
 * /api/carrito/{userId}:
 *   get:
 *     summary: Obtener el carrito de un usuario
 *     tags: [Carrito]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Carrito obtenido
 *       404:
 *         description: Carrito no encontrado
 */
router.get('/:userId', carritoController.obtenerCarrito);

/**
 * @swagger
 * /api/carrito/{userId}:
 *   post:
 *     summary: Agregar un producto al carrito
 *     tags: [Carrito]
 *     parameters:
 *       - in: path
 *         name: userId
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
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Producto agregado
 */
router.post('/:userId', carritoController.agregarProducto);

/**
 * @swagger
 * /api/carrito/{userId}/{productId}:
 *   put:
 *     summary: Actualizar cantidad de un producto en el carrito
 *     tags: [Carrito]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Cantidad actualizada
 */
router.put('/:userId/:productId', carritoController.actualizarCantidad);

/**
 * @swagger
 * /api/carrito/{userId}/{productId}:
 *   delete:
 *     summary: Eliminar un producto del carrito
 *     tags: [Carrito]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto eliminado
 */
router.delete('/:userId/:productId', carritoController.eliminarProducto);

/**
 * @swagger
 * /api/carrito/{userId}:
 *   delete:
 *     summary: Vaciar el carrito de un usuario
 *     tags: [Carrito]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Carrito vaciado
 */
router.delete('/:userId', carritoController.vaciarCarrito);

module.exports = router;