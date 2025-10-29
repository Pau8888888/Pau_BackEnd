const Categoria = require('../models/Categoria');

const createCategoria = async (categoriaData) => {
    const newCategoria = new Categoria(categoriaData);
    return await newCategoria.save();
};

module.exports = {
    createCategoria,
};
