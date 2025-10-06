const mongoose = require('mongoose');

const usuariSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // índice único
    lowercase: true,
    trim: true,
  },
  contrasenya: {
    type: String,
    required: true,
    minlength: 6,
  },
  rol: {
    type: String,
    enum: ['usuari', 'admin'],
    default: 'usuari',
  },
}, {
  timestamps: true, // crea createdAt i updatedAt automàticament
});

// Índex opcional para búsquedas rápidas por email
usuariSchema.index({ email: 1 });

module.exports = mongoose.model('Usuari', usuariSchema);
