const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkoutController');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/checkout/create-session - Protegit per auth
router.post('/create-session', express.json(), authMiddleware, checkoutController.createCheckoutSession);

// POST /api/checkout/webhook - Stripe necessita que el body sigui RAW per validar la firma
// Aquest endpoint NO ha de tenir authMiddleware perquè Stripe no envia tokens JWT
router.post('/webhook', express.raw({ type: 'application/json' }), checkoutController.stripeWebhook);

module.exports = router;