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
}, {
  timestamps: true,
});

// 🔐 Encriptar contrasenya abans de guardar
usuariSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// 🔐 Comparar contrasenya
usuariSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Índex per optimitzar cerques
usuariSchema.index({ email: 1 });

module.exports = mongoose.model('Usuari', usuariSchema);
