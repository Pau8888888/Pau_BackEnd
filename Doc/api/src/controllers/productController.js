const productService = require('../services/productService');

// 🟢 Crear un producte
const createProduct = async (req, res, next) => {
  try {
    const product = await productService.createProduct(req.body);
    req.log.info({ productId: product._id }, 'Product created');
    res.status(201).json({ status: 'success', data: product });
  } catch (error) {
    error.statusCode = 400;
    next(error);
  }
};

// 🟡 Mostrar tots els productes
const getAllProducts = async (req, res, next) => {
  try {
    req.log.info({ requestId: req.requestId }, 'Getting product list');
    const products = await productService.getAllProducts();
    res.status(200).json({ status: 'success', data: products });
  } catch (error) {
    next(error);
  }
};

// 🔵 Mostrar un producte per ID
const getProductById = async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Producte no trobat' });
    }
    res.status(200).json({ status: 'success', data: product });
  } catch (error) {
    next(error);
  }
};

// 🟠 Actualitzar un producte per ID
const updateProduct = async (req, res, next) => {
  try {
    const updatedProduct = await productService.updateProduct(req.params.id, req.body);
    if (!updatedProduct) {
      return res.status(404).json({ status: 'error', message: 'Producte no trobat' });
    }
    req.log.info({ productId: updatedProduct._id }, 'Product updated');
    res.status(200).json({ status: 'success', data: updatedProduct });
  } catch (error) {
    error.statusCode = 400;
    next(error);
  }
};

// 🔴 Eliminar un producte per ID
const deleteProduct = async (req, res, next) => {
  try {
    const deleted = await productService.deleteProduct(req.params.id);
    if (!deleted) {
      return res.status(404).json({ status: 'error', message: 'Producte no trobat' });
    }
    req.log.info({ productId: req.params.id }, 'Product deleted');
    res.status(200).json({ status: 'success', message: 'Producte eliminat correctament' });
  } catch (error) {
    next(error);
  }
};

// Exportar totes les funcions
module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
};
