# Turf Play

A full-stack web application for turf booking and management built with React and Node.js.

## Tech Stack

### Frontend
- React 19
- TypeScript
- Vite
- React Router DOM
- Axios
- Tailwind CSS

### Backend
- Node.js
- Express 5
- Prisma ORM
- PostgreSQL
- JWT Authentication
- bcryptjs

## Prerequisites

Before running this project, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [PostgreSQL](https://www.postgresql.org/download/) (v14 or higher)
- npm or yarn

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd turf-play
```

### 2. Backend Setup

```bash
cd backend
npm install
```

#### Configure Environment Variables

Create a `.env` file in the `backend` directory:

```env
DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5432/DATABASE_NAME"
JWT_SECRET=your_jwt_secret_key_here
PORT=8000
CLIENT_URL=http://localhost:5173
```

Replace:
- `USERNAME` - Your PostgreSQL username
- `PASSWORD` - Your PostgreSQL password
- `DATABASE_NAME` - Your database name (e.g., `turf_play`)

#### Generate Prisma Client & Push Schema

```bash
npx prisma generate
npx prisma db push
```

#### Start Backend Server

```bash
node server.js
```

Or with auto-reload:

```bash
npx nodemon server.js
```

The backend will run on `http://localhost:8000`

### 3. Frontend Setup

```bash
cd frontend
npm install
```

#### Start Frontend Development Server

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/signup` | Register a new user |
| POST | `/api/v1/auth/login` | Login user |
| GET | `/api/v1/auth/getUser` | Get current user (Protected) |

### Request/Response Examples

#### Signup
```json
POST /api/v1/auth/signup
{
  "fullname": "John Doe",
  "email": "john@example.com",
  "pass": "password123"
}
```

#### Login
```json
POST /api/v1/auth/login
{
  "email": "john@example.com",
  "pass": "password123"
}
```

## Project Structure

```
turf-play/
├── backend/
│   ├── controllers/
│   │   └── authController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   └── authRoutes.js
│   ├── prisma/
│   │   └── schema.prisma
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── utils/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## Database Schema

```prisma
model User {
  id              Int      @id @default(autoincrement())
  fullname        String
  email           String   @unique
  pass            String?
  profileImageUrl String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

## Running in Production

### Backend
```bash
cd backend
NODE_ENV=production node server.js
```

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Verify your DATABASE_URL format: `postgresql://user:password@host:port/database`
- Check if the database exists

### Prisma Issues
```bash
npx prisma generate  # Regenerate Prisma Client
npx prisma db push   # Sync schema with database
```

### Port Already in Use
- Backend default: 8000
- Frontend default: 5173
- Change ports in `.env` (backend) or `vite.config.ts` (frontend)

## License

MIT

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
