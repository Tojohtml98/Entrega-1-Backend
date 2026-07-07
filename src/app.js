const express = require('express');
const cors = require('cors');
const passport = require('./config/passport.config');
const sessionsRoutes = require('./routes/sessions.routes');
const productsRoutes = require('./routes/products.routes');
const cartsRoutes = require('./routes/carts.routes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Inicializar Passport
app.use(passport.initialize());

// Rutas
app.use('/api/sessions', sessionsRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/carts', cartsRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    message: 'API de Ecommerce funcionando correctamente',
    endpoints: {
      health: 'GET /health',
      register: 'POST /api/sessions/register',
      login: 'POST /api/sessions/login',
      current: 'GET /api/sessions/current (requiere token JWT)',
      products: {
        list: 'GET /api/products',
        create: 'POST /api/products (admin)',
        update: 'PUT /api/products/:id (admin)',
        delete: 'DELETE /api/products/:id (admin)'
      },
      carts: {
        addProduct: 'POST /api/carts/:cid/products/:pid (user)',
        purchase: 'POST /api/carts/:cid/purchase (user)'
      }
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Error interno del servidor'
  });
});

module.exports = app;
