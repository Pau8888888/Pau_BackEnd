const Pedido = require('../models/Pedido');

const createPedido = async (pedidoData) => {
    const newPedido = new Pedido(pedidoData);
    return await newPedido.save();
};

module.exports = {
    createPedido,
};
