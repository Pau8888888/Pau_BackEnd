const mongoose = require('mongoose');

const categoriaSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  descripcio: {
    type: String,
    default: '',
    trim: true,
  },
}, {
  timestamps: true,
});

categoriaSchema.index({ nom: 1 });

module.exports = mongoose.model('Categoria', categoriaSchema);
