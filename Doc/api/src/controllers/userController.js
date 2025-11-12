const usuariService = require('../services/userService');

// 🔹 Registre
const registrar = async (req, res) => {
  try {
    const usuariCreat = await usuariService.registrarUsuari(req.body);
    res.status(201).json({ 
      status: 'success', 
      message: 'Usuari registrat correctament', 
      data: usuariCreat 
    });
  } catch (error) {
    res.status(400).json({ 
      status: 'error', 
      message: error.message 
    });
  }
};

// 🔹 Login
const login = async (req, res) => {
  try {
    const usuariLogin = await usuariService.loginUsuari(req.body);
    res.status(200).json({ 
      status: 'success', 
      message: 'Login correcte', 
      data: usuariLogin 
    });
  } catch (error) {
    res.status(400).json({ 
      status: 'error', 
      message: error.message 
    });
  }
};

module.exports = { registrar, login };
