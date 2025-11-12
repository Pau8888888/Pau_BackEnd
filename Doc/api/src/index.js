require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// ✅ Middleware per JSON i formularis
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Connexió a MongoDB
connectDB();

// ✅ Rutes bàsiques
app.get('/', (req, res) => res.send('API Ecommerce en marxa'));

// ✅ Rutes API
app.use('/api/products', productRoutes);
app.use('/api/usuaris', userRoutes);

// ✅ Arrencar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor actiu al port ${PORT}`));
