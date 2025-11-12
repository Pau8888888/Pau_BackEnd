const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Connexió a MongoDB amb la URI de l'arxiu .env
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ MongoDB connectat correctament');
    
  } catch (err) {
    console.error('❌ Error en connectar a MongoDB:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
