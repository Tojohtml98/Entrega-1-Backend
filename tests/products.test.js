const request = require('supertest');
const app = require('../src/app');
const { registerUser } = require('./helpers');

describe('Products API', () => {
  let adminToken;
  let userToken;

  const sampleProduct = { title: 'Mate Imperial', price: 15000, stock: 10 };

  beforeEach(async () => {
    ({ token: adminToken } = await registerUser({ email: 'admin@test.com', role: 'admin' }));
    ({ token: userToken } = await registerUser({ email: 'client@test.com', role: 'user' }));
  });

  describe('GET /api/products (público)', () => {
    it('devuelve lista vacía cuando no hay productos', async () => {
      const res = await request(app).get('/api/products');

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(Array.isArray(res.body.products)).toBe(true);
      expect(res.body.products).toHaveLength(0);
    });
  });

  describe('POST /api/products (solo admin)', () => {
    it('permite a un admin crear un producto', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(sampleProduct);

      expect(res.status).toBe(201);
      expect(res.body.product.title).toBe('Mate Imperial');
      expect(res.body.product.price).toBe(15000);
    });

    it('rechaza a un usuario no-admin con 403', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${userToken}`)
        .send(sampleProduct);

      expect(res.status).toBe(403);
    });

    it('rechaza sin token con 401', async () => {
      const res = await request(app).post('/api/products').send(sampleProduct);
      expect(res.status).toBe(401);
    });

    it('rechaza datos incompletos con 400', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ title: 'Sin precio ni stock' });

      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/products/:id', () => {
    it('devuelve un producto existente', async () => {
      const created = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(sampleProduct);
      const id = created.body.product._id;

      const res = await request(app).get(`/api/products/${id}`);

      expect(res.status).toBe(200);
      expect(res.body.product.title).toBe('Mate Imperial');
    });

    it('devuelve 404 para un id inexistente', async () => {
      const res = await request(app).get('/api/products/64b5f0000000000000000000');
      expect(res.status).toBe(404);
    });
  });

  describe('PUT /api/products/:id (solo admin)', () => {
    it('permite a un admin actualizar un producto', async () => {
      const created = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(sampleProduct);
      const id = created.body.product._id;

      const res = await request(app)
        .put(`/api/products/${id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ price: 20000 });

      expect(res.status).toBe(200);
      expect(res.body.product.price).toBe(20000);
    });
  });

  describe('DELETE /api/products/:id (solo admin)', () => {
    it('permite a un admin borrar un producto y luego devuelve 404', async () => {
      const created = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(sampleProduct);
      const id = created.body.product._id;

      const del = await request(app)
        .delete(`/api/products/${id}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(del.status).toBe(200);

      const res = await request(app).get(`/api/products/${id}`);
      expect(res.status).toBe(404);
    });
  });
});
