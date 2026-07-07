<h1 align="center">Clean Architecture E-commerce API</h1>

<p align="center">
  <strong>JWT-secured e-commerce backend with role-based access, DAO/Repository/DTO layering and email-based password recovery.</strong>
</p>

<p align="center">
  <a href="https://nodejs-clean-architecture-api.onrender.com">Live API ↗</a> ·
  <a href="https://nodejs-clean-architecture-api.onrender.com/health">Health ↗</a> ·
  <a href="./API_EXAMPLES.md">API Examples ↗</a>
</p>

<p align="center">
  <a href="https://github.com/Tojohtml98/Nodejs-Clean-Architecture-API/actions/workflows/ci.yml">
    <img src="https://github.com/Tojohtml98/Nodejs-Clean-Architecture-API/actions/workflows/ci.yml/badge.svg" alt="CI" />
  </a>
  <img src="https://img.shields.io/badge/tests-Jest-C21325?logo=jest&logoColor=white" alt="Jest" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-20-339933?logo=node.js&logoColor=white" alt="Node 20" />
  <img src="https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/JWT-secured-000000?logo=jsonwebtokens&logoColor=white" alt="JWT" />
  <img src="https://img.shields.io/badge/Passport-auth-34E27A?logo=passport&logoColor=white" alt="Passport" />
  <img src="https://img.shields.io/badge/bcrypt-hash-yellow" alt="bcrypt" />
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT" />
</p>

---

## Overview

An e-commerce backend built with the constraints senior teams actually care about: **clear separation between transport, domain and persistence**, **secrets-aware authentication** and **a real password recovery flow** — not a TODO comment.

The architecture splits responsibilities across five layers so the cost of changing the database, the wire format or the auth strategy stays bounded:

- **Controllers** speak HTTP. They never touch Mongoose.
- **Services** hold business rules (purchase a cart, hash a password, expire a token).
- **Repositories** expose a stable domain API.
- **DAOs** wrap Mongoose. Swap them for SQL and the service layer never notices.
- **DTOs** decide what leaves the system — passwords and internal ids stay inside.

---

## Tech Stack

- **Runtime** — Node.js 20 (CommonJS), Express 4
- **Auth** — Passport (JWT + Local strategies), bcrypt for password hashing
- **Database** — MongoDB Atlas (Mongoose 7)
- **Email** — Nodemailer (SMTP) for password reset tokens
- **Tooling** — dotenv, cors, nodemon

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│   Controllers   ──▶   Services   ──▶   Repositories     │
│   (HTTP I/O)        (business)         (domain API)     │
│                                              │          │
│                                              ▼          │
│                                            DAOs         │
│                                          (Mongoose)     │
│                                              │          │
│                                              ▼          │
│                                       MongoDB Atlas     │
└─────────────────────────────────────────────────────────┘
           ▲                  ▲
           │                  │
       Passport            DTOs
      (JWT/Local)     (response shaping)
```

**Key invariant:** the service layer talks to repositories only — never directly to the database. Swapping Mongoose for Prisma or even a remote API client is a DAO-level change, not a refactor.

---

## Quick Start

```bash
git clone https://github.com/Tojohtml98/Nodejs-Clean-Architecture-API.git
cd Nodejs-Clean-Architecture-API
npm install
cp .env.example .env   # fill MONGO_URI + JWT_SECRET (+ MAIL_* for reset emails)
npm start              # production
npm run dev            # nodemon
```

Server boots on `http://localhost:8080`.

---

## Testing

The suite runs against a **real MongoDB in memory** (`mongodb-memory-server`) — no mocks, no external database. Each test file boots an isolated Mongo instance and collections are cleared between tests, so runs are deterministic and side-effect free.

```bash
npm test
```

- **17 integration tests** covering auth (register / login / `current` with JWT) and the products CRUD (public reads, admin-only writes, 401/403/404 paths).
- Exercised end-to-end through `supertest` against the real Express app.
- Runs on every push and pull request via **GitHub Actions** (see the CI badge above).

> To keep the app testable, `app.js` only builds and exports the Express instance; `server.js` owns the DB connection and `listen()`. This lets tests import the app without opening real ports or connections.

---

## API Reference

### Sessions

| Method | Endpoint                              | Auth     | Description                              |
| ------ | ------------------------------------- | -------- | ---------------------------------------- |
| POST   | `/api/sessions/register`              | Public   | Create a user (`role: user \| admin`)    |
| POST   | `/api/sessions/login`                 | Public   | Returns a JWT                            |
| GET    | `/api/sessions/current`               | JWT      | Returns the current user as a DTO        |
| POST   | `/api/sessions/forgot-password`       | Public   | Sends a reset link (token expires in 1h) |
| POST   | `/api/sessions/reset-password`        | Token    | New password (must differ from old)      |

### Products

| Method | Endpoint              | Auth   | Description    |
| ------ | --------------------- | ------ | -------------- |
| GET    | `/api/products`       | Public | List products  |
| GET    | `/api/products/:pid`  | Public | Get one        |
| POST   | `/api/products`       | Admin  | Create         |
| PUT    | `/api/products/:pid`  | Admin  | Update         |
| DELETE | `/api/products/:pid`  | Admin  | Remove         |

### Carts

| Method | Endpoint                          | Auth | Description                                 |
| ------ | --------------------------------- | ---- | ------------------------------------------- |
| POST   | `/api/carts/:cid/products/:pid`   | User | Add product to own cart                     |
| POST   | `/api/carts/:cid/purchase`        | User | Generate ticket, returns out-of-stock items |

### System

| Method | Endpoint    | Description                |
| ------ | ----------- | -------------------------- |
| GET    | `/`         | API index                  |
| GET    | `/health`   | Uptime + status JSON       |

### Try it (cURL)

```bash
# Liveness
curl https://nodejs-clean-architecture-api.onrender.com/health

# Register
curl -X POST https://nodejs-clean-architecture-api.onrender.com/api/sessions/register \
  -H "Content-Type: application/json" \
  -d '{"first_name":"Tomas","last_name":"Orella","email":"demo@example.com","age":26,"password":"demo1234"}'

# Login (capture the JWT in $TOKEN)
TOKEN=$(curl -s -X POST https://nodejs-clean-architecture-api.onrender.com/api/sessions/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"demo1234"}' | jq -r .token)

# Authenticated request
curl https://nodejs-clean-architecture-api.onrender.com/api/sessions/current \
  -H "Authorization: Bearer $TOKEN"
```

See [`API_EXAMPLES.md`](./API_EXAMPLES.md) for the full request catalogue.

---

## Environment

| Variable          | Required | Description                                       |
| ----------------- | -------- | ------------------------------------------------- |
| `MONGO_URI`       | Yes      | MongoDB Atlas connection string                   |
| `JWT_SECRET`      | Yes      | Signing secret for access tokens                  |
| `JWT_EXPIRES_IN`  | No       | Token TTL (default `7d`)                          |
| `BASE_URL`        | No       | Public URL used in reset-password emails          |
| `MAIL_HOST`       | If reset | SMTP host (e.g. `smtp.gmail.com`)                 |
| `MAIL_PORT`       | If reset | SMTP port (`587` for STARTTLS)                    |
| `MAIL_USER`       | If reset | SMTP user                                         |
| `MAIL_PASS`       | If reset | SMTP password / app password                      |
| `MAIL_FROM`       | If reset | `From:` header for outbound mail                  |
| `PORT`            | No       | HTTP port (default `8080`)                        |
| `NODE_ENV`        | No       | `development` \| `production`                     |

---

## Deployment

- **Host:** Render (free tier) · `render.yaml` blueprint at repo root
- **CD:** Auto-deploy on push to `main`
- **DB:** MongoDB Atlas (M0 cluster, separate database per project)
- **Cold start:** ~25s on first hit after idle (free tier limitation)

---

## Design Decisions

- **Why DAO + Repository + DTO instead of "Mongoose everywhere"?** Mongoose models leak across the codebase when used directly: queries appear in controllers, response shaping mixes with persistence, and replacing the database means touching every route. The cost of the extra layer is paid back the first time a model changes.
- **Why Passport with JWT *and* Local?** Local handles the credential exchange; JWT handles every subsequent request stateless. Passport gives both a uniform middleware shape, so adding a third strategy (OAuth, magic link) is a config change.
- **Why a real password reset flow over "just patch the password"?** Anything other than time-bounded one-shot tokens is either insecure (the email is the auth) or annoying (resetting requires support). One hour, single use, hashed at rest — and the new password cannot reuse the old one.
- **Why DTOs even for `/current`?** `User` has a `password` field. The day someone forgets to `.select('-password')` is the day it ships to a frontend. DTOs make that the type system's problem, not the developer's memory.

---

## License

MIT © [Tomás Orella](https://github.com/Tojohtml98)
