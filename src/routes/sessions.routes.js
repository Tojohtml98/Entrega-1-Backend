const express = require('express');
const router = express.Router();
const passport = require('passport');
const sessionsController = require('../controllers/sessions.controller');

// Ruta de registro
router.post('/register', sessionsController.register);

// Ruta de login
router.post('/login', sessionsController.login);

// Ruta para obtener usuario actual (requiere autenticación JWT)
router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  sessionsController.getCurrentUser
);

module.exports = router;
