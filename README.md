# Ecommerce Backend - Sistema de Autenticación y Autorización

## Descripción

Proyecto backend de ecommerce con sistema completo de autenticación y autorización utilizando Passport y JWT.

## Características

- CRUD de usuarios
- Autenticación con JWT
- Autorización basada en roles
- Encriptación de contraseñas con bcrypt
- Validación de sesiones

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
```bash
cp .env.example .env
```

3. Editar el archivo `.env` con tus credenciales de MongoDB y JWT secret.

4. Iniciar el servidor:
```bash
npm start
```

Para desarrollo con nodemon:
```bash
npm run dev
```

## Estructura del Proyecto

```
├── src/
│   ├── config/
│   │   └── database.js
│   ├── models/
│   │   ├── User.js
│   │   └── Cart.js
│   ├── config/
│   │   └── passport.config.js
│   ├── routes/
│   │   └── sessions.routes.js
│   ├── controllers/
│   │   └── sessions.controller.js
│   └── app.js
├── .env
├── .gitignore
└── package.json
```

## Endpoints

### Autenticación

- `POST /api/sessions/register` - Registrar nuevo usuario
- `POST /api/sessions/login` - Iniciar sesión
- `GET /api/sessions/current` - Obtener usuario actual (requiere token JWT)

## Tecnologías

- Node.js
- Express
- MongoDB / Mongoose
- Passport.js
- JWT
- bcrypt
