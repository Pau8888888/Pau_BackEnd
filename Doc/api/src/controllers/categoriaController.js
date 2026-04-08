const categoriaService = require('../services/categoriaService');

const createCategoria = async (req, res) => {
    try {
        const payload = req.body;
        const categoriaData = {
            nom: payload.name || payload.nom,
            descripcio: payload.description || payload.descripcio
        };
        const categoria = await categoriaService.createCategoria(categoriaData);
        res.status(201).json({ status: 'success', data: categoria });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};

module.exports = {
    createCategoria,
};
