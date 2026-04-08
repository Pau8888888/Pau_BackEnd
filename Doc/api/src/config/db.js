const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // 🔧 Afegeix aquest log per veure quina URI es connecta
    console.log('Intentant connectar a la URI:', process.env.MONGO_URI);

    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log('✅ MongoDB connectat correctament');
    
  } catch (err) {
    console.error('❌ Error en connectar a MongoDB:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;