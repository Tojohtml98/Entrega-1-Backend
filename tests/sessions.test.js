const request = require('supertest');
const app = require('../src/app');
const { registerUser } = require('./helpers');

describe('Sessions API (auth)', () => {
  const validUser = {
    first_name: 'Ada',
    last_name: 'Lovelace',
    email: 'ada@test.com',
    age: 30,
    password: 'secret123'
  };

  describe('POST /api/sessions/register', () => {
    it('registra un usuario y devuelve token + user sin password', async () => {
      const res = await request(app)
        .post('/api/sessions/register')
        .send(validUser);

      expect(res.status).toBe(201);
      expect(res.body.status).toBe('success');
      expect(typeof res.body.token).toBe('string');
      expect(res.body.user.email).toBe('ada@test.com');
      expect(res.body.user.role).toBe('user');
      // El DTO nunca debe exponer el password
      expect(res.body.user.password).toBeUndefined();
    });

    it('rechaza campos faltantes con 400', async () => {
      const res = await request(app)
        .post('/api/sessions/register')
        .send({ email: 'incompleto@test.com', password: 'secret123' });

      expect(res.status).toBe(400);
      expect(res.body.status).toBe('error');
    });

    it('rechaza email duplicado con 400', async () => {
      await request(app).post('/api/sessions/register').send(validUser);
      const res = await request(app)
        .post('/api/sessions/register')
        .send(validUser);

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/ya está registrado/i);
    });
  });

  describe('POST /api/sessions/login', () => {
    beforeEach(async () => {
      await request(app).post('/api/sessions/register').send(validUser);
    });

    it('loguea con credenciales válidas y devuelve token', async () => {
      const res = await request(app)
        .post('/api/sessions/login')
        .send({ email: validUser.email, password: validUser.password });

      expect(res.status).toBe(200);
      expect(typeof res.body.token).toBe('string');
      expect(res.body.user.email).toBe(validUser.email);
    });

    it('rechaza password incorrecto con 401', async () => {
      const res = await request(app)
        .post('/api/sessions/login')
        .send({ email: validUser.email, password: 'wrongpass' });

      expect(res.status).toBe(401);
      expect(res.body.message).toMatch(/credenciales inválidas/i);
    });

    it('rechaza usuario inexistente con 401', async () => {
      const res = await request(app)
        .post('/api/sessions/login')
        .send({ email: 'nadie@test.com', password: 'secret123' });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/sessions/current', () => {
    it('devuelve el usuario actual con un token válido', async () => {
      const { token } = await registerUser({ email: 'current@test.com' });

      const res = await request(app)
        .get('/api/sessions/current')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.user.email).toBe('current@test.com');
      expect(res.body.user.password).toBeUndefined();
    });

    it('rechaza el acceso sin token con 401', async () => {
      const res = await request(app).get('/api/sessions/current');
      expect(res.status).toBe(401);
    });
  });
});
