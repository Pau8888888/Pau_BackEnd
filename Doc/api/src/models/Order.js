const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  productos: [{
    productoId: {
      type: String,
      required: true
    },
    nombre: {
      type: String,
      required: true
    },
    precio: {
      type: Number,
      required: true
    },
    cantidad: {
      type: Number,
      required: true
    },
    imagen: String,
    talla: String
  }],
  total: {
    type: Number,
    required: true
  },
  estado: {
    type: String,
    enum: ['pendiente', 'pagado', 'enviado', 'completado', 'cancelado'],
    default: 'pendiente'
  },
  cliente: {
    nombre: String,
    email: String,
    telefono: String,
    direccion: String
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema);