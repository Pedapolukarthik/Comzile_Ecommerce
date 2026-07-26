# Production-Ready Multi-Tenant SaaS eCommerce Platform (Phase 1 Foundation)

Enterprise monorepo foundation for a multi-tenant SaaS eCommerce platform powered by Node.js, Express, Prisma ORM, MySQL, and React (Vite).

## Enterprise Folder Structure

```
c:/Comzile_ecommerce/
├── package.json                   # Root package.json (npm workspaces configuration)
├── .gitignore                     # Git ignore rules for node_modules, build artifacts, env
├── README.md                      # Complete setup & operations guide
├── backend/                       # Node.js + Express.js API Gateway
│   ├── package.json
│   ├── .env                       # Local Environment configuration
│   ├── .env.example               # Environment template
│   ├── prisma/
│   │   └── schema.prisma          # Prisma schema with MySQL & multi-tenant foundation (store_id)
│   └── src/
│       ├── config/
│       │   ├── env.config.js      # Centralized environment variable validation
│       │   └── prisma.js          # Prisma Client setup & logging
│       ├── constants/
│       │   └── roles.js           # SUPER_ADMIN, SELLER, CUSTOMER, STAFF
│       ├── middleware/
│       │   ├── auth.middleware.js # JWT verification
│       │   ├── role.middleware.js # RBAC authorization checks
│       │   ├── tenant.middleware.js # Store/Tenant context injector (store_id)
│       │   ├── security.middleware.js # Helmet, CORS, Rate Limiter, Compression
│       │   └── error.middleware.js# Global error handling middleware
│       ├── utils/
│       │   ├── logger.js          # Structured Winston logger
│       │   ├── appError.js        # Custom Operational Error class
│       │   └── apiResponse.js     # Standard JSON API response helper
│       ├── routes/
│       │   └── v1/                # Versioned API routes (/api/v1)
│       │       ├── index.js
│       │       ├── auth.routes.js
│       │       └── health.routes.js
│       ├── app.js                 # Express app initialization
│       └── server.js              # Server entry point
├── apps/
│   ├── admin-panel/               # React (Vite) - Super Admin Console (Port 3000)
│   ├── seller-panel/              # React (Vite) - Seller Control Center (Port 3001)
│   └── customer-panel/            # React (Vite) - Customer Storefront (Port 3002)
└── packages/
    ├── shared-ui/                 # Reusable UI component package (@comzile/shared-ui)
    └── shared-services/           # Shared API client & constants (@comzile/shared-services)
```

---

## Installed Dependencies

### Backend (`/backend`)
- `express`: Core Web Framework
- `@prisma/client` & `prisma`: MySQL ORM & Migration Tooling
- `jsonwebtoken`: JWT Authentication Engine
- `bcryptjs`: Password Hashing Foundation
- `helmet`: Security HTTP Headers
- `cors`: Cross-Origin Resource Sharing
- `express-rate-limit`: Rate Limiting Guard
- `compression`: Response Body Compression
- `winston`: Production Structured Logging
- `dotenv`: Environment Variable Management
- `nodemon`: Development Auto-restart

### React Applications (`/apps/*`)
- `react` & `react-dom` (v18)
- `vite` & `@vitejs/plugin-react`

### Shared Packages (`/packages/*`)
- `@comzile/shared-ui`: Exporting shared React design components.
- `@comzile/shared-services`: `axios` based API client configured for `Authorization` and `x-store-id` headers.

---

## Database Setup

1. Make sure MySQL server is running locally or remotely.
2. Create a database named `comzile_saas_db`.
3. Update `DATABASE_URL` in `backend/.env`:
   ```env
   DATABASE_URL="mysql://root:password@localhost:3306/comzile_saas_db"
   ```
4. Run Prisma schema generation and migrations:
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

---

## Environment Variables (`backend/.env`)

| Variable | Description | Default Value |
| --- | --- | --- |
| `PORT` | Server listening port | `5000` |
| `NODE_ENV` | Environment mode | `development` |
| `API_VERSION` | API Versioning prefix | `v1` |
| `JWT_SECRET` | Secret key for JWT signing | `super_secret_jwt_key_...` |
| `JWT_EXPIRES_IN` | JWT token validity duration | `1d` |
| `DATABASE_URL` | MySQL Connection URI | `"mysql://root:localhost:3306/..."` |
| `ALLOWED_ORIGINS` | Allowed origins for CORS | `"http://localhost:3000,..."` |

---

## Files Created in Phase 1

1. Root: `package.json`, `.gitignore`, `README.md`
2. Backend:
   - `backend/package.json`, `backend/.env`, `backend/.env.example`
   - `backend/prisma/schema.prisma`
   - `backend/src/config/env.config.js`, `backend/src/config/prisma.js`
   - `backend/src/constants/roles.js`
   - `backend/src/utils/logger.js`, `backend/src/utils/appError.js`, `backend/src/utils/apiResponse.js`
   - `backend/src/middleware/auth.middleware.js`, `backend/src/middleware/role.middleware.js`, `backend/src/middleware/tenant.middleware.js`, `backend/src/middleware/security.middleware.js`, `backend/src/middleware/error.middleware.js`
   - `backend/src/routes/v1/index.js`, `backend/src/routes/v1/health.routes.js`, `backend/src/routes/v1/auth.routes.js`
   - `backend/src/app.js`, `backend/src/server.js`
3. React Apps:
   - `apps/admin-panel/package.json`, `vite.config.js`, `index.html`, `src/App.jsx`, `src/main.jsx`, `src/index.css`
   - `apps/seller-panel/package.json`, `vite.config.js`, `index.html`, `src/App.jsx`, `src/main.jsx`, `src/index.css`
   - `apps/customer-panel/package.json`, `vite.config.js`, `index.html`, `src/App.jsx`, `src/main.jsx`, `src/index.css`
4. Shared Packages:
   - `packages/shared-ui/package.json`, `packages/shared-ui/src/index.js`
   - `packages/shared-services/package.json`, `packages/shared-services/src/index.js`

---

## Commands to Run the Project

### 1. Install Dependencies
Run from workspace root:
```bash
npm install
```

### 2. Generate Prisma Client
```bash
npm run prisma:generate
```

### 3. Run Backend API Server (Port 5000)
```bash
npm run dev:backend
```

### 4. Run React Applications
- **Admin Panel** (Port 3000):
  ```bash
  npm run dev:admin
  ```
- **Seller Panel** (Port 3001):
  ```bash
  npm run dev:seller
  ```
- **Customer Panel** (Port 3002):
  ```bash
  npm run dev:customer
  ```
