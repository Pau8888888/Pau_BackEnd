require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');

const app = express();

// 👇 AIXÒ ÉS IMPRESCINDIBLE — ha d’estar abans de les rutes
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); // també per formularis

connectDB();

app.get('/', (req, res) => res.send('API Ecommerce en marxa'));

// 👇 Rutes API
app.use('/api/products', productRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor actiu al port ${PORT}`));
