const pedidoService = require('../services/pedidoService');

const createPedido = async (req, res) => {
    try {
        const payload = req.body;
        const pedidoData = {
           usuari: payload.user || payload.usuari,
           adrecaEnviament: payload.shippingAddress || payload.adrecaEnviament,
           metodePagament: payload.paymentMethod || payload.metodePagament,
           total: payload.total,
           productes: payload.products ? payload.products.map(p => ({
               producte: p.product || p.producte,
               quantitat: p.quantity || p.quantitat,
               preuUnitari: p.unitPrice || p.preuUnitari
           })) : payload.productes
        };
        const pedido = await pedidoService.createPedido(pedidoData);
        res.status(201).json({ status: 'success', data: pedido });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};

module.exports = {
    createPedido,
};
