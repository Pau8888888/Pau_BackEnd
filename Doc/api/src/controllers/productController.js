const productService = require('../services/productService');

// 🟢 Crear un producte
const createProduct = async (req, res) => {
  try {
    console.log("📦 Body rebut:", req.body); // 👈 DEBUG: comprovar si arriba el body

    const product = await productService.createProduct(req.body);
    res.status(201).json({ status: 'success', data: product });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

// 🟡 Mostrar tots els productes
const getAllProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.status(200).json({ status: 'success', data: products });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// 🔵 Mostrar un producte per ID
const getProductById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Producte no trobat' });
    }
    res.status(200).json({ status: 'success', data: product });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// 🟠 Actualitzar un producte per ID
const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await productService.updateProduct(req.params.id, req.body);
    if (!updatedProduct) {
      return res.status(404).json({ status: 'error', message: 'Producte no trobat' });
    }
    res.status(200).json({ status: 'success', data: updatedProduct });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

// 🔴 Eliminar un producte per ID
const deleteProduct = async (req, res) => {
  try {
    const deleted = await productService.deleteProduct(req.params.id);
    if (!deleted) {
      return res.status(404).json({ status: 'error', message: 'Producte no trobat' });
    }
    res.status(200).json({ status: 'success', message: 'Producte eliminat correctament' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
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
