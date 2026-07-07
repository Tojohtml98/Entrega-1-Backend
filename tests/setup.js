const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

// Secret determinista para los tests (antes de que se carguen los módulos de auth)
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret_key';

let mongo;

// Levanta un MongoDB real en memoria antes de correr la suite
beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
});

// Limpia todas las colecciones entre tests para aislarlos
afterEach(async () => {
  const { collections } = mongoose.connection;
  for (const key of Object.keys(collections)) {
    await collections[key].deleteMany({});
  }
});

// Cierra la conexión y apaga el servidor en memoria al terminar
afterAll(async () => {
  await mongoose.disconnect();
  if (mongo) await mongo.stop();
});
