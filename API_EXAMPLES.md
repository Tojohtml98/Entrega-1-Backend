# Ejemplos de Uso de la API

## Endpoints Disponibles

### 1. Registrar Usuario
**POST** `/api/sessions/register`

**Body:**
```json
{
  "first_name": "Juan",
  "last_name": "Pérez",
  "email": "juan@example.com",
  "age": 25,
  "password": "password123",
  "role": "user"
}
```

**Respuesta exitosa (201):**
```json
{
  "status": "success",
  "message": "Usuario registrado correctamente",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "first_name": "Juan",
    "last_name": "Pérez",
    "email": "juan@example.com",
    "age": 25,
    "role": "user",
    "cart": "64f1a2b3c4d5e6f7a8b9c0d2"
  }
}
```

### 2. Login
**POST** `/api/sessions/login`

**Body:**
```json
{
  "email": "juan@example.com",
  "password": "password123"
}
```

**Respuesta exitosa (200):**
```json
{
  "status": "success",
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "first_name": "Juan",
    "last_name": "Pérez",
    "email": "juan@example.com",
    "age": 25,
    "role": "user",
    "cart": "64f1a2b3c4d5e6f7a8b9c0d2"
  }
}
```

### 3. Obtener Usuario Actual
**GET** `/api/sessions/current`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Respuesta exitosa (200):**
```json
{
  "status": "success",
  "user": {
    "id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "first_name": "Juan",
    "last_name": "Pérez",
    "email": "juan@example.com",
    "age": 25,
    "role": "user",
    "cart": {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d2",
      "products": [],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

**Respuesta de error (401):**
```json
{
  "status": "error",
  "message": "No autorizado"
}
```

## Ejemplos con cURL

### Registrar usuario:
```bash
curl -X POST http://localhost:8080/api/sessions/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Juan",
    "last_name": "Pérez",
    "email": "juan@example.com",
    "age": 25,
    "password": "password123"
  }'
```

### Login:
```bash
curl -X POST http://localhost:8080/api/sessions/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "password123"
  }'
```

### Obtener usuario actual:
```bash
curl -X GET http://localhost:8080/api/sessions/current \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

## Ejemplos con JavaScript (Fetch)

### Registrar usuario:
```javascript
const response = await fetch('http://localhost:8080/api/sessions/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    first_name: 'Juan',
    last_name: 'Pérez',
    email: 'juan@example.com',
    age: 25,
    password: 'password123'
  })
});

const data = await response.json();
console.log(data);
```

### Login:
```javascript
const response = await fetch('http://localhost:8080/api/sessions/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'juan@example.com',
    password: 'password123'
  })
});

const data = await response.json();
const token = data.token;
localStorage.setItem('token', token);
```

### Obtener usuario actual:
```javascript
const token = localStorage.getItem('token');

const response = await fetch('http://localhost:8080/api/sessions/current', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const data = await response.json();
console.log(data);
```
