const userService = require('../services/userService');

// POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const user = await userService.registrarUsuari(req.body);
    req.log.info({ userId: user.id, email: user.email }, 'User registered successfully');
    return res.status(201).json({
      status: 'success',
      message: 'Usuari registrat correctament',
      data: user,
    });
  } catch (error) {
    error.statusCode = 400;
    return next(error);
  }
};

// POST /api/auth/login
const login = async (req, res, next) => {
  const { email } = req.body || {};
  try {
    const { user, tokens } = await userService.loginUsuari(req.body);
    req.log.info({ userId: user.id, email: user.email }, 'User logged in successfully');
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
    req.log.warn({ email }, 'Invalid login attempt');
    error.statusCode = 400;
    return next(error);
  }
};

// POST /api/auth/refresh
// Si req.body existe: Extrae el valor de refreshToken con normalidad.
const refresh = async (req, res, next) => {
  try {
    const refreshToken = req.body?.refreshToken;
    if (!refreshToken) {
      const err = new Error('No hi ha refresh token');
      err.statusCode = 401;
      return next(err);
    }

    const { user, tokens } = await userService.refreshTokenUsuari(refreshToken);
    req.log.info({ userId: user.id }, 'Token refreshed successfully');
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
    return next(error);
  }
};

// POST /api/auth/logout
const logout = async (req, res, next) => {
  try {
    const refreshToken = req.body?.refreshToken;
    if (!refreshToken) {
      const err = new Error('No hi ha refresh token');
      err.statusCode = 401;
      return next(err);
    }

    await userService.logoutUsuari(refreshToken);
    req.log.info({ userId: req.user?.id || null }, 'User logged out');
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};

module.exports = { register, login, refresh, logout };
