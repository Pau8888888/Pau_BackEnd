const Carrito = require('../models/Carrito');

// Obtener carrito por usuario
exports.obtenerCarrito = async (req, res) => {
  try {
    const { userId } = req.params;
    
    let carrito = await Carrito.findOne({ user: userId });
    
    if (!carrito) {
      carrito = new Carrito({ user: userId, products: [] });
      await carrito.save();
    }
    
    res.json(carrito);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener el carrito', error: error.message });
  }
};

// Agregar producto al carrito
exports.agregarProducto = async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId, name, price, quantity, image } = req.body;
    
    let carrito = await Carrito.findOne({ user: userId });
    
    if (!carrito) {
      carrito = new Carrito({ user: userId, products: [] });
    }
    
    const productoExistente = carrito.products.find(
      p => p.productId.toString() === productId
    );
    
    if (productoExistente) {
      productoExistente.quantity += quantity;
    } else {
      carrito.products.push({
        productId,
        name,
        price,
        quantity,
        image
      });
    }
    
    carrito.calcularTotal();
    await carrito.save();
    
    res.json(carrito);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al agregar producto', error: error.message });
  }
};

// Actualizar cantidad
exports.actualizarCantidad = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const { quantity } = req.body;
    
    const carrito = await Carrito.findOne({ user: userId });
    
    if (!carrito) {
      return res.status(404).json({ mensaje: 'Carrito no encontrado' });
    }
    
    const producto = carrito.products.find(
      p => p.productId.toString() === productId
    );
    
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    
    producto.quantity = quantity;
    carrito.calcularTotal();
    await carrito.save();
    
    res.json(carrito);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar', error: error.message });
  }
};

// Eliminar producto
exports.eliminarProducto = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    
    const carrito = await Carrito.findOne({ user: userId });
    
    if (!carrito) {
      return res.status(404).json({ mensaje: 'Carrito no encontrado' });
    }
    
    carrito.products = carrito.products.filter(
      p => p.productId.toString() !== productId
    );
    
    carrito.calcularTotal();
    await carrito.save();
    
    res.json(carrito);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar', error: error.message });
  }
};

// Vaciar carrito
exports.vaciarCarrito = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const carrito = await Carrito.findOne({ user: userId });
    
    if (!carrito) {
      return res.status(404).json({ mensaje: 'Carrito no encontrado' });
    }
    
    carrito.products = [];
    carrito.total = 0;
    await carrito.save();
    
    res.json({ mensaje: 'Carrito vaciado', carrito });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al vaciar', error: error.message });
  }
};