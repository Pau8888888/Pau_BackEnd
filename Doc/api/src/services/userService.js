const Usuari = require('../models/Usuari');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// 🔹 Registrar usuari
const registrarUsuari = async ({ name, email, password }) => {
  const existe = await Usuari.findOne({ email });
  if (existe) throw new Error('Email ja està en ús');

  if (!password || password.length < 6) {
    throw new Error('La contrasenya ha de tenir almenys 6 caràcters');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const nouUsuari = new Usuari({ name, email, password: hashedPassword });
  const usuariGuardat = await nouUsuari.save();

  return {
    id: usuariGuardat._id,
    name: usuariGuardat.name,
    email: usuariGuardat.email,
    role: usuariGuardat.role,
  };
};

// 🔹 Login usuari (genera access i refresh tokens)
const loginUsuari = async ({ email, password }) => {
  const usuari = await Usuari.findOne({ email });
  if (!usuari) throw new Error('Usuari no trobat');

  const valid = await bcrypt.compare(password, usuari.password);
  if (!valid) throw new Error('Contrasenya incorrecta');

  const accessToken = jwt.sign(
    { id: usuari._id, role: usuari.role },
    process.env.ACCESS_TOKEN_SECRET || 'accessSecret',
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { id: usuari._id },
    process.env.REFRESH_TOKEN_SECRET || 'refreshSecret',
    { expiresIn: '7d' }
  );

  usuari.refreshToken = refreshToken;
  await usuari.save();

  return {
    user: { id: usuari._id, name: usuari.name, email: usuari.email, role: usuari.role },
    tokens: { accessToken, refreshToken }
  };
};

// 🔹 Logout usuari (invalida el refresh token)
const logoutUsuari = async (refreshToken) => {
  await Usuari.findOneAndUpdate({ refreshToken }, { refreshToken: null });
};

// 🔹 Renovar tokens con rotación segura
const refreshTokenUsuari = async (refreshToken) => {
  if (!refreshToken) throw new Error('No hi ha refresh token');

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || 'refreshSecret');
  } catch {
    throw new Error('Refresh token invàlid');
  }

  const usuari = await Usuari.findOne({ _id: decoded.id, refreshToken });
  if (!usuari) throw new Error('Usuari no trobat o refresh token invàlid');

  const newAccessToken = jwt.sign(
    { id: usuari._id, role: usuari.role },
    process.env.ACCESS_TOKEN_SECRET || 'accessSecret',
    { expiresIn: '15m' }
  );

  const newRefreshToken = jwt.sign(
    { id: usuari._id },
    process.env.REFRESH_TOKEN_SECRET || 'refreshSecret',
    { expiresIn: '7d' }
  );

  usuari.refreshToken = newRefreshToken;
  await usuari.save();

  return {
    user: { id: usuari._id, name: usuari.name, email: usuari.email, role: usuari.role },
    tokens: { accessToken: newAccessToken, refreshToken: newRefreshToken }
  };
};

// 🔹 Actualizar contraseña por id
const actualizarContrasenya = async (id, novaContrasenya) => {
  const usuari = await Usuari.findById(id);
  if (!usuari) throw new Error('Usuari no trobat');

  if (!novaContrasenya || novaContrasenya.length < 6) {
    throw new Error('La nova contrasenya ha de tenir almenys 6 caràcters');
  }

  const hashedPassword = await bcrypt.hash(novaContrasenya, 10);
  usuari.password = hashedPassword;
  await usuari.save();

  return {
    id: usuari._id,
    name: usuari.name,
    email: usuari.email,
  };
};

module.exports = { registrarUsuari, loginUsuari, logoutUsuari, refreshTokenUsuari, actualizarContrasenya };
