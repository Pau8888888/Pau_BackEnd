const mongoose = require('mongoose');

const pedidoSchema = new mongoose.Schema({
  usuari: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuari',
    required: true,
  },
  productes: [
    {
      producte: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Producte',
        required: true,
      },
      quantitat: {
        type: Number,
        required: true,
        min: 1,
      },
      preuUnitari: {
        type: Number,
        required: true,
        min: 0,
      },
    },
  ],
  total: {
    type: Number,
    required: true,
    min: 0,
  },
  estat: {
    type: String,
    enum: ['pendent', 'en procés', 'enviat', 'lliurat', 'cancel·lat'],
    default: 'pendent',
  },
  adrecaEnviament: {
    type: String,
    required: true,
    trim: true,
  },
  metodePagament: {
    type: String,
    enum: ['targeta', 'paypal', 'transferencia'],
    default: 'targeta',
  },
}, {
  timestamps: true,
});

pedidoSchema.index({ usuari: 1 });
pedidoSchema.index({ estat: 1 });

pedidoSchema.pre('save', function (next) {
  if (this.productes?.length > 0) {
    this.total = this.productes.reduce(
      (acc, item) => acc + item.preuUnitari * item.quantitat,
      0
    );
  }
  next();
});

module.exports = mongoose.model('Pedido', pedidoSchema);