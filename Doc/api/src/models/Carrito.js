const mongoose = require('mongoose');

const carritoSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuari',
    required: false
  },
  productos: [{
    productoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
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
      required: true,
      default: 1
    },
    imagen: String
  }],
  total: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Método para calcular el total
carritoSchema.methods.calcularTotal = function() {
  this.total = this.productos.reduce((sum, item) => {
    return sum + (item.precio * item.cantidad);
  }, 0);
  return this.total;
};

module.exports = mongoose.model('Carrito', carritoSchema);