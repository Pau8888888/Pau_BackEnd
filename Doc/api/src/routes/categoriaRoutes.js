const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');

// Crear una categoría
router.post('/', categoriaController.createCategoria);

// Obtener todas las categorías
router.get('/', categoriaController.getAllCategorias);

// Obtener una categoría por ID
router.get('/:id', categoriaController.getCategoriaById);

// Actualizar una categoría por ID
router.put('/:id', categoriaController.updateCategoria);

// Eliminar una categoría por ID
router.delete('/:id', categoriaController.deleteCategoria);

module.exports = router;
