# ⚡ PowerTrack – Energy Analytics SaaS Dashboard

A full-stack energy usage analytics platform built with React, TypeScript, Node.js, MongoDB, and JWT authentication. Inspired by enterprise-grade utility dashboards used at Fortune 500 energy companies.

## 🔴 Live Demo
👉 [powertrack.vercel.app](https://powertrack.vercel.app)

## 🛠️ Tech Stack

### Frontend
- **React 18** + **TypeScript**
- **Redux Toolkit** – global state management
- **Material UI (MUI v5)** – component library
- **Recharts** – interactive data visualizations
- **React Router v6** – protected routing
- **Axios** – HTTP client with interceptors
- **react-window** – virtualisation for large datasets

### Backend
- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose ODM**
- **JWT** – access & refresh token authentication
- **bcryptjs** – password hashing
- **express-validator** – input validation

### DevOps
- **GitHub Actions** – CI/CD pipeline
- **Vercel** – frontend deployment
- **Render** – backend deployment
- **Jest + React Testing Library** – 68% test coverage

---

## 🏗️ Architecture Overview

```
powertrack/
├── client/                   # React + TypeScript frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/         # Login, Register forms
│   │   │   ├── dashboard/    # Charts, KPI cards, filters
│   │   │   └── layout/       # Navbar, Sidebar, ProtectedRoute
│   │   ├── pages/            # Home, Dashboard, Profile, Admin
│   │   ├── store/            # Redux Toolkit slices
│   │   ├── hooks/            # Custom React hooks
│   │   ├── utils/            # API client, helpers
│   │   └── types/            # TypeScript interfaces
│   └── package.json
├── server/                   # Node.js + Express backend
│   ├── controllers/          # Route handler logic
│   ├── middleware/            # Auth, error, validation
│   ├── models/               # Mongoose schemas
│   ├── routes/               # Express route definitions
│   └── package.json
├── .github/workflows/        # CI/CD pipeline
└── README.md
```

---

## 🔐 Role-Based Access Control (RBAC)

| Feature | Admin | Analyst | Viewer |
|---|---|---|---|
| View dashboards | ✅ | ✅ | ✅ |
| Filter & export data | ✅ | ✅ | ❌ |
| Manage users | ✅ | ❌ | ❌ |
| Configure meters | ✅ | ❌ | ❌ |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone the repo
```bash
git clone https://github.com/balajikolli/powertrack.git
cd powertrack
```

### 2. Backend setup
```bash
cd server
cp .env.example .env
# Fill in your MongoDB URI, JWT secrets
npm install
npm run dev
```

### 3. Frontend setup
```bash
cd client
cp .env.example .env
# Set REACT_APP_API_URL=http://localhost:5000
npm install
npm start
```

### 4. Seed demo data
```bash
cd server
npm run seed
```

### Demo accounts
| Role | Email | Password |
|---|---|---|
| Admin | admin@powertrack.com | Admin@123 |
| Analyst | analyst@powertrack.com | Analyst@123 |
| Viewer | viewer@powertrack.com | Viewer@123 |

---

## 🧪 Running Tests
```bash
cd client
npm test                  # Run all tests
npm run test:coverage     # Coverage report
```

---

## 📦 CI/CD Pipeline

Every pull request triggers:
1. ESLint + TypeScript type check
2. Jest test suite
3. Production build

Every merge to `main` triggers:
1. All PR checks
2. Auto-deploy backend → Render
3. Auto-deploy frontend → Vercel

---

## 📊 Key Features

- **Interactive Charts** – Line, bar, and area charts for energy consumption trends
- **Real-time Filtering** – Filter by date range, region, meter type with instant chart updates
- **10,000+ Data Points** – Virtualised rendering with react-window for zero UI lag
- **JWT Auth** – HTTP-only cookie sessions with automatic token refresh
- **Export** – Download filtered data as CSV (Analyst/Admin only)
- **Admin Panel** – User management, role assignment

---

## 📄 License
MIT
