const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const carritoRoutes = require('./routes/carritoRoutes');
const orderRoutes = require('./routes/orderRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');

const app = express();

// ✅ Configurar CORS (IMPORTANTE para que React pueda conectar)
app.use(cors({
  origin: 'http://localhost:5173', // Puerto de tu frontend React
  credentials: true
}));

// ✅ Middleware para JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Conexión a MongoDB
connectDB();

// ✅ Ruta básica
app.get('/', (req, res) => res.send('API Ecommerce en marcha'));

// ✅ Rutas API
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/products', productRoutes);
app.use('/api/usuaris', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/carrito', carritoRoutes);
app.use('/api', orderRoutes); // ✅ Ruta de orders
app.use('/api/categories', categoriaRoutes); // ✅ Ruta de categories
app.use('/api/pedidos', pedidoRoutes); // ✅ Ruta de pedidos

// ✅ Arrancar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor activo en http://localhost:${PORT}`);
});
