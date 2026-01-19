const express = require('express');
const router = express.Router();
const { createOrder, getOrders, getOrderById } = require('../controllers/orderController');

// Crear pedido
router.post('/pedidos', createOrder);

// Obtener todos los pedidos
router.get('/pedidos', getOrders);

// Obtener pedido por ID
router.get('/pedidos/:id', getOrderById);

module.exports = router;