const request = require('supertest');
const app = require('../src/app');

// Registra un usuario y devuelve su token JWT + datos.
// role: 'user' (por defecto) o 'admin'.
async function registerUser(overrides = {}) {
  const payload = {
    first_name: 'Test',
    last_name: 'User',
    email: `user_${Date.now()}_${Math.round(Math.random() * 1e6)}@test.com`,
    age: 25,
    password: 'secret123',
    ...overrides
  };

  const res = await request(app)
    .post('/api/sessions/register')
    .send(payload);

  return { token: res.body.token, user: res.body.user, payload };
}

module.exports = { registerUser };
