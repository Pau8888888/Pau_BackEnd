const express = require('express');
const router = express.Router();
const carritoController = require('../controllers/carritoController');

/**
 * @swagger
 * /api/carrito/{usuarioId}:
 *   get:
 *     summary: Obtener el carrito de un usuario
 *     tags: [Carrito]
 *     parameters:
 *       - in: path
 *         name: usuarioId
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
router.get('/:usuarioId', carritoController.obtenerCarrito);

/**
 * @swagger
 * /api/carrito/{usuarioId}:
 *   post:
 *     summary: Agregar un producto al carrito
 *     tags: [Carrito]
 *     parameters:
 *       - in: path
 *         name: usuarioId
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
 *               productoId:
 *                 type: string
 *               cantidad:
 *                 type: number
 *     responses:
 *       200:
 *         description: Producto agregado
 */
router.post('/:usuarioId', carritoController.agregarProducto);

/**
 * @swagger
 * /api/carrito/{usuarioId}/{productoId}:
 *   put:
 *     summary: Actualizar cantidad de un producto en el carrito
 *     tags: [Carrito]
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *       - in: path
 *         name: productoId
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
 *               cantidad:
 *                 type: number
 *     responses:
 *       200:
 *         description: Cantidad actualizada
 */
router.put('/:usuarioId/:productoId', carritoController.actualizarCantidad);

/**
 * @swagger
 * /api/carrito/{usuarioId}/{productoId}:
 *   delete:
 *     summary: Eliminar un producto del carrito
 *     tags: [Carrito]
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *       - in: path
 *         name: productoId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto eliminado
 */
router.delete('/:usuarioId/:productoId', carritoController.eliminarProducto);

/**
 * @swagger
 * /api/carrito/{usuarioId}:
 *   delete:
 *     summary: Vaciar el carrito de un usuario
 *     tags: [Carrito]
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Carrito vaciado
 */
router.delete('/:usuarioId', carritoController.vaciarCarrito);

module.exports = router;