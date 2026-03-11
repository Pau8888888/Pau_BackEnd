const userService = require('../services/userService');

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const user = await userService.registrarUsuari(req.body);
    return res.status(201).json({
      status: 'success',
      message: 'Usuari registrat correctament',
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { user, tokens } = await userService.loginUsuari(req.body);
    return res.status(200).json({
      status: 'success',
      message: 'Login correcte',
      data: {
        id: user.id,
        role: user.role,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    });
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

// POST /api/auth/refresh
const refresh = async (req, res) => {
  try {
    const refreshToken = req.body?.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ status: 'error', message: 'No hi ha refresh token' });
    }

    const { user, tokens } = await userService.refreshTokenUsuari(refreshToken);
    return res.status(200).json({
      status: 'success',
      data: {
        id: user.id,
        role: user.role,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

// POST /api/auth/logout
const logout = async (req, res) => {
  try {
    const refreshToken = req.body?.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ status: 'error', message: 'No hi ha refresh token' });
    }

    await userService.logoutUsuari(refreshToken);
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

module.exports = { register, login, refresh, logout };
