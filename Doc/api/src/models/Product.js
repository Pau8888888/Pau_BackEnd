const mongoose = require('mongoose');

const producteSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    trim: true,
  },
  descripcio: {
    type: String,
    required: true,
  },
  preu: {
    type: Number,
    required: true,
    min: 0,
  },
  stock: {
    type: Number,
    default: 0,
    min: 0,
  },
  categoria: {
    type: String,
    required: true,
    index: true, // índice para búsquedas por categoría
  },
}, {
  timestamps: true,
});

// Índex compuesto opcional: categoría + precio
producteSchema.index({ categoria: 1, preu: -1 });

module.exports = mongoose.model('Producte', producteSchema);
