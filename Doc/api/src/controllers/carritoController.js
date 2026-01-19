const Carrito = require('../models/Carrito');

// Obtener carrito por usuario
exports.obtenerCarrito = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    
    let carrito = await Carrito.findOne({ usuario: usuarioId });
    
    if (!carrito) {
      carrito = new Carrito({ usuario: usuarioId, productos: [] });
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
    const { usuarioId } = req.params;
    const { productoId, nombre, precio, cantidad, imagen } = req.body;
    
    let carrito = await Carrito.findOne({ usuario: usuarioId });
    
    if (!carrito) {
      carrito = new Carrito({ usuario: usuarioId, productos: [] });
    }
    
    const productoExistente = carrito.productos.find(
      p => p.productoId.toString() === productoId
    );
    
    if (productoExistente) {
      productoExistente.cantidad += cantidad;
    } else {
      carrito.productos.push({
        productoId,
        nombre,
        precio,
        cantidad,
        imagen
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
    const { usuarioId, productoId } = req.params;
    const { cantidad } = req.body;
    
    const carrito = await Carrito.findOne({ usuario: usuarioId });
    
    if (!carrito) {
      return res.status(404).json({ mensaje: 'Carrito no encontrado' });
    }
    
    const producto = carrito.productos.find(
      p => p.productoId.toString() === productoId
    );
    
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    
    producto.cantidad = cantidad;
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
    const { usuarioId, productoId } = req.params;
    
    const carrito = await Carrito.findOne({ usuario: usuarioId });
    
    if (!carrito) {
      return res.status(404).json({ mensaje: 'Carrito no encontrado' });
    }
    
    carrito.productos = carrito.productos.filter(
      p => p.productoId.toString() !== productoId
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
    const { usuarioId } = req.params;
    
    const carrito = await Carrito.findOne({ usuario: usuarioId });
    
    if (!carrito) {
      return res.status(404).json({ mensaje: 'Carrito no encontrado' });
    }
    
    carrito.productos = [];
    carrito.total = 0;
    await carrito.save();
    
    res.json({ mensaje: 'Carrito vaciado', carrito });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al vaciar', error: error.message });
  }
};