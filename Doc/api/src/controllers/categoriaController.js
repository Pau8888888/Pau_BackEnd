const categoriaService = require('../services/categoriaService');

const createCategoria = async (req, res) => {
    try {
        const categoria = await categoriaService.createCategoria(req.body);
        res.status(201).json({ status: 'success', data: categoria });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};

module.exports = {
    createCategoria,
};
