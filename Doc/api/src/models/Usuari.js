const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const usuariSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['client', 'admin'],
    default: 'client',
  },
  refreshToken: {
    type: String,
  },
}, {
  timestamps: true,
});

// 🔐 Comparar contrasenya (opcional, si es vol fer així)
usuariSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

// Índex per optimitzar cerques
usuariSchema.index({ email: 1 });

module.exports = mongoose.model('Usuari', usuariSchema);
