const Order = require('../models/Order');

// Crear un nuevo pedido
const createOrder = async (req, res) => {
  try {
    const { productos, total, cliente, estado } = req.body;

    // Validar que hay productos
    if (!productos || productos.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'El pedido debe contener al menos un producto'
      });
    }

    // Crear nuevo pedido
    const nuevoPedido = new Order({
      productos,
      total,
      cliente,
      estado: estado || 'pendiente'
    });

    // Guardar en la base de datos
    await nuevoPedido.save();

    res.status(201).json({
      success: true,
      message: 'Pedido creado correctamente',
      pedido: nuevoPedido
    });

  } catch (error) {
    console.error('Error al crear pedido:', error);
    res.status(500).json({
      success: false,
      message: 'Error al procesar el pedido',
      error: error.message
    });
  }
};

// Obtener todos los pedidos
const getOrders = async (req, res) => {
  try {
    const pedidos = await Order.find().sort({ fechaCreacion: -1 });
    res.json({
      success: true,
      pedidos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener pedidos'
    });
  }
};

// Obtener un pedido por ID
const getOrderById = async (req, res) => {
  try {
    const pedido = await Order.findById(req.params.id);
    
    if (!pedido) {
      return res.status(404).json({
        success: false,
        message: 'Pedido no encontrado'
      });
    }

    res.json({
      success: true,
      pedido
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener el pedido'
    });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById
};