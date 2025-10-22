const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const usuariSchema = new mongoose.Schema({
  nom: {
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
  timestamps: true,
});

usuariSchema.pre('save', async function (next) {
  if (!this.isModified('contrasenya')) return next();
  this.contrasenya = await bcrypt.hash(this.contrasenya, 10);
  next();
});

usuariSchema.methods.compararContrasenya = async function (password) {
  return await bcrypt.compare(password, this.contrasenya);
};

usuariSchema.index({ email: 1 });

module.exports = mongoose.model('Usuari', usuariSchema);
