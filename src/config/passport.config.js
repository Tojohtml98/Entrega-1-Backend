const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

// Configuración de la estrategia JWT
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'tu_secret_key_super_segura_aqui'
};

// Estrategia JWT para autenticación
passport.use(new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    const user = await User.findById(payload.userId).populate('cart');
    
    if (!user) {
      return done(null, false);
    }
    
    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
}));

// Estrategia Local para login
passport.use('local', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return done(null, false, { message: 'Usuario no encontrado' });
    }
    
    const isMatch = user.comparePassword(password);
    
    if (!isMatch) {
      return done(null, false, { message: 'Contraseña incorrecta' });
    }
    
    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
}));

// Serialización del usuario
passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
