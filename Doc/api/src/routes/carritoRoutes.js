const express = require('express');
const router = express.Router();
const carritoController = require('../controllers/carritoController');

router.get('/:usuarioId', carritoController.obtenerCarrito);
router.post('/:usuarioId', carritoController.agregarProducto);
router.put('/:usuarioId/:productoId', carritoController.actualizarCantidad);
router.delete('/:usuarioId/:productoId', carritoController.eliminarProducto);
router.delete('/:usuarioId', carritoController.vaciarCarrito);

module.exports = router;