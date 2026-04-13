const express = require('express');
const router = express.Router();
const { createOrder, getOrders, getUserOrders, getOrderById } = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Totes les rutes de comandes requereixen autenticació
router.use(authMiddleware);

// Rutes per a clients
router.get('/my-orders', getUserOrders);
router.get('/:id', getOrderById);
router.post('/', createOrder);

// Rutes per a admins
router.get('/', roleMiddleware(['admin']), getOrders);

module.exports = router;