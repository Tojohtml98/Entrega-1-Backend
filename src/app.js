require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const passport = require('./config/passport.config');
const sessionsRoutes = require('./routes/sessions.routes');

const app = express();
const PORT = process.env.PORT || 8080;

// Conectar a la base de datos
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Inicializar Passport
app.use(passport.initialize());

// Rutas
app.use('/api/sessions', sessionsRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    message: 'API de Ecommerce funcionando correctamente',
    endpoints: {
      register: 'POST /api/sessions/register',
      login: 'POST /api/sessions/login',
      current: 'GET /api/sessions/current (requiere token JWT)'
    }
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

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

module.exports = app;
