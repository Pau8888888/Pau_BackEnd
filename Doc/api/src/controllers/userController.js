const usuariService = require('../services/userService');

// 🔹 Registre
const registrar = async (req, res) => {
  try {
    const usuariCreat = await usuariService.registrarUsuari(req.body);
    res.status(201).json({
      status: 'success',
      message: 'Usuari registrat correctament',
      usuariCreat,
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

// 🔹 Login amb generació de tokens
const login = async (req, res) => {
  try {
    const { user, tokens } = await usuariService.loginUsuari(req.body);
    res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, secure: false });
    return res.status(200).json({
      status: 'success',
      message: 'Login correcte',
      data: {
        id: user.id,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

// 🔹 Logout amb invalidació del refresh token
const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) return res.status(401).json({ status: 'error', message: 'No hi ha refresh token' });

    await usuariService.logoutUsuari(refreshToken);
    res.clearCookie('refreshToken');
    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

// 🔹 Renovació de tokens amb rotació segura
const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) return res.status(401).json({ status: 'error', message: 'No hi ha refresh token' });

    const { user, tokens } = await usuariService.refreshTokenUsuari(refreshToken);
    res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, secure: false });
    return res.status(200).json({
      status: 'success',
      data: {
        id: user.id,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

// 🔹 Actualizar contraseña por id
const actualizarContrasenya = async (req, res) => {
  try {
    const { id } = req.params;
    const { novaContrasenya } = req.body;

    if (!novaContrasenya || novaContrasenya.length < 6) {
      return res.status(400).json({
        status: 'error',
        message: 'La nova contrasenya ha de tenir almenys 6 caràcters'
      });
    }

    const usuariActualitzat = await usuariService.actualizarContrasenya(id, novaContrasenya);

    res.status(200).json({
      status: 'success',
      message: 'Contrasenya actualitzada correctament',
      data: usuariActualitzat
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

module.exports = { registrar, login, logout, refreshToken, actualizarContrasenya };
