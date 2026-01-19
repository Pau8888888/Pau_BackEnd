require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const carritoRoutes = require('./routes/carritoRoutes');
const orderRoutes = require('./routes/orderRoutes'); // ✅ Nueva ruta

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
app.use('/api/products', productRoutes);
app.use('/api/usuaris', userRoutes);
app.use('/api/carrito', carritoRoutes);
app.use('/api', orderRoutes); // ✅ Ruta de pedidos

// ✅ Arrancar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor activo en http://localhost:${PORT}`);
});