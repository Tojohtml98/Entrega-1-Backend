const passport = require('passport');

// Middleware para autenticación JWT
const authenticateJWT = passport.authenticate('jwt', { session: false });

// Middleware para verificar rol de administrador
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({
    status: 'error',
    message: 'Acceso denegado. Se requieren permisos de administrador.'
  });
};

module.exports = {
  authenticateJWT,
  isAdmin
};
