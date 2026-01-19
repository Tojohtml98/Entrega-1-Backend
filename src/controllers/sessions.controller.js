const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Cart = require('../models/Cart');

const JWT_SECRET = process.env.JWT_SECRET || 'tu_secret_key_super_segura_aqui';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// Registrar nuevo usuario
const register = async (req, res) => {
  try {
    const { first_name, last_name, email, age, password, role } = req.body;

    // Validar campos requeridos
    if (!first_name || !last_name || !email || !age || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Todos los campos son requeridos'
      });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'El email ya está registrado'
      });
    }

    // Crear un carrito nuevo para el usuario
    const newCart = new Cart();
    await newCart.save();

    // Crear nuevo usuario (la contraseña se encriptará automáticamente en el pre-save hook)
    const newUser = new User({
      first_name,
      last_name,
      email: email.toLowerCase(),
      age,
      password, // Se encriptará automáticamente
      cart: newCart._id,
      role: role || 'user'
    });

    await newUser.save();

    // Generar token JWT
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(201).json({
      status: 'success',
      message: 'Usuario registrado correctamente',
      token,
      user: {
        id: newUser._id,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        email: newUser.email,
        age: newUser.age,
        role: newUser.role,
        cart: newUser.cart
      }
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al registrar usuario',
      error: error.message
    });
  }
};

// Login de usuario
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Email y contraseña son requeridos'
      });
    }

    // Buscar usuario
    const user = await User.findOne({ email: email.toLowerCase() }).populate('cart');

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Credenciales inválidas'
      });
    }

    // Verificar contraseña
    const isMatch = user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        status: 'error',
        message: 'Credenciales inválidas'
      });
    }

    // Generar token JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      status: 'success',
      message: 'Login exitoso',
      token,
      user: {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        age: user.age,
        role: user.role,
        cart: user.cart
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al iniciar sesión',
      error: error.message
    });
  }
};

// Obtener usuario actual (requiere autenticación)
const getCurrentUser = async (req, res) => {
  try {
    // El usuario ya está disponible en req.user gracias al middleware de Passport
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'No autorizado'
      });
    }

    // Populate el cart si existe
    const user = await User.findById(req.user._id).populate('cart');

    res.json({
      status: 'success',
      user: {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        age: user.age,
        role: user.role,
        cart: user.cart
      }
    });
  } catch (error) {
    console.error('Error al obtener usuario actual:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener información del usuario',
      error: error.message
    });
  }
};

module.exports = {
  register,
  login,
  getCurrentUser
};
