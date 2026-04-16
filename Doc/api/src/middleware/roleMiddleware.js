// RBAC

module.exports = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Accés prohibit' });
    }
    return next();
  };
};

// Verificar qué tienes permitido hacer segun tu rol