const pedidoService = require('../services/pedidoService');

const createPedido = async (req, res) => {
    try {
        const pedido = await pedidoService.createPedido(req.body);
        res.status(201).json({ status: 'success', data: pedido });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};

module.exports = {
    createPedido,
};
