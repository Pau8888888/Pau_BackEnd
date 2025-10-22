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
  imatge: {
    type: String,
    default: 'default.jpg',
  },
  categoria: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Categoria',
    required: true,
  },
  creatPer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuari',
  },
}, {
  timestamps: true,
});

producteSchema.index({ categoria: 1, preu: -1 });

module.exports = mongoose.model('Producte', producteSchema);
