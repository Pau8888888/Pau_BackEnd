const mongoose = require('mongoose');

const pedidoSchema = new mongoose.Schema(
  {
    usuari: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuari',
      required: true
    },
    adrecaEnviament: {
      type: String,
      required: true
    },
    metodePagament: {
      type: String,
      default: 'card'
    },
    total: {
      type: Number,
      required: true
    },
    productes: [
      {
        producte: {
          type: mongoose.Schema.Types.Mixed,
          required: true
        },
        quantitat: {
          type: Number,
          required: true,
          min: 1
        },
        preuUnitari: {
          type: Number,
          required: true,
          min: 0
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Pedido', pedidoSchema);
