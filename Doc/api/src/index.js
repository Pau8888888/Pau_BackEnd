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

const checkoutRoutes = require('./routes/checkoutRoutes');

const app = express();

// ✅ Configurar CORS (accepta dev i producció)
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost',
  'http://frontend',
  'http://frontend:80'
];
app.use(cors({
  origin: function (origin, callback) {
    // Permetre peticions sense origin (Postman, curl, Nginx proxy)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('CORS no permès per a: ' + origin));
  },
  credentials: true
}));

// ✅ Conexió a MongoDB
connectDB();

// ✅ Ruta de webhook de Stripe (HA D'ANAR ABANS de express.json())
app.use('/api/checkout', checkoutRoutes);

// ✅ Middleware para JSON y formularios (per a la resta de rutes)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Ruta básica
app.get('/', (req, res) => res.send('API Ecommerce en marcha'));

// ✅ Rutas API
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/products', productRoutes);
app.use('/api/usuaris', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/carrito', carritoRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoriaRoutes);
app.use('/api/pedidos', pedidoRoutes);



// ✅ Arrancar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor activo en http://0.0.0.0:${PORT}`);
});
