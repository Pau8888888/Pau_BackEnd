const Order = require('../models/Order');

// Crear un nuevo pedido (normalment via checkout, però deixem l'endpoint per si de cas)
const createOrder = async (req, res) => {
  try {
    const { products, total, shippingAddress, status } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'La comanda ha de contenir almenys un producte'
      });
    }

    const newOrder = new Order({
      user: req.user.userId,
      products,
      total,
      shippingAddress,
      status: status || 'pending'
    });

    await newOrder.save();

    res.status(201).json({
      success: true,
      message: 'Comanda creada correctament',
      order: newOrder
    });

  } catch (error) {
    console.error('Error al crear comanda:', error);
    res.status(500).json({
      success: false,
      message: 'Error al processar la comanda',
      error: error.message
    });
  }
};

// Obtenir totes les comandes (Admin)
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json({
      success: true,
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtenir comandes'
    });
  }
};

// Obtenir comandes de l'usuari actual
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId }).sort({ createdAt: -1 });
    res.json({
      success: true,
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtenir les teves comandes'
    });
  }
};

// Obtenir una comanda per ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Comanda no trobada'
      });
    }

    // Verificar si és l'usuari de la comanda o un admin
    if (order.user._id.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'No tens permís per veure aquesta comanda' });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtenir la comanda'
    });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getUserOrders,
  getOrderById
};