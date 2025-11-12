const Usuari = require('../models/Usuari');
const jwt = require('jsonwebtoken');

// 🔹 Registrar usuari
const registrarUsuari = async ({ name, email, password }) => {
  const existe = await Usuari.findOne({ email });
  if (existe) throw new Error('Email ja està en ús');

  const nouUsuari = new Usuari({ name, email, password });
  await nouUsuari.save();

  return { 
    id: nouUsuari._id, 
    name: nouUsuari.name, 
    email: nouUsuari.email 
  };
};

// 🔹 Login usuari
const loginUsuari = async ({ email, password }) => {
  const usuari = await Usuari.findOne({ email });
  if (!usuari) throw new Error('Usuari no trobat');

  const valid = await usuari.comparePassword(password);
  if (!valid) throw new Error('Contrasenya incorrecta');

  const token = jwt.sign(
    { id: usuari._id, email: usuari.email },
    process.env.JWT_SECRET || 'clauSecreta',
    { expiresIn: '1h' }
  );

  return { 
    token, 
    usuari: { 
      id: usuari._id, 
      name: usuari.name, 
      email: usuari.email 
    } 
  };
};

module.exports = { registrarUsuari, loginUsuari };
