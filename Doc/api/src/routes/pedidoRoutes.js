const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Pedidos
 *   description: Gestión de pedidos
 */

/**
 * @swagger
 * /api/pedidos:
 *   post:
 *     summary: Crear un pedido
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user
 *               - products
 *               - shippingAddress
 *             properties:
 *               user:
 *                 type: string
 *                 description: "User ID"
 *               products:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/OrderProduct'
 *               shippingAddress:
 *                 type: string
 *                 description: "Shipping Address"
 *               paymentMethod:
 *                 type: string
 *                 enum: [card, paypal, transfer]
 *                 description: Payment Method
 *     responses:
 *       201:
 *         description: Pedido creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 */
router.post('/', authMiddleware, pedidoController.createPedido);

module.exports = router;
