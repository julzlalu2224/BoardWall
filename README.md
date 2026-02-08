# BoardWall - Smart Task, Time Tracking, and Reporting System

A production-ready SaaS MVP for managing tasks, tracking time, and generating reports for small teams.

## 🎯 Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for blazing-fast development
- Tailwind CSS for styling
- React Query for data fetching
- React Hook Form for form validation
- Zustand for state management
- Recharts for analytics visualization
- Lucide React for icons

### Backend
- NestJS (Node.js + TypeScript)
- Prisma ORM
- PostgreSQL database
- JWT authentication with bcrypt
- Swagger API documentation
- Role-based access control

### DevOps
- Docker & Docker Compose
- PostgreSQL containerized database
- Nginx reverse proxy
- Environment-based configuration

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- PostgreSQL 16+ (if running without Docker)

### Option 1: Running with Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/julzlalu2224/BoardWall.git
cd BoardWall

# Start all services
docker-compose up -d

# Access the application
Frontend: http://localhost:3000
Backend API: http://localhost:3001
API Docs: http://localhost:3001/api
```

### Option 2: Running Locally

#### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Update .env with your PostgreSQL credentials
# DATABASE_URL="postgresql://username:password@localhost:5432/boardwall"

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database with demo data
npx prisma db seed

# Start development server
npm run start:dev
```

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

## 📦 Demo Credentials

After seeding the database, you can log in with:

- **Admin User**
  - Email: admin@boardwall.com
  - Password: password123

- **Manager User**
  - Email: manager@boardwall.com
  - Password: password123

- **Member User**
  - Email: member@boardwall.com
  - Password: password123

## 🏗️ Project Structure

```
BoardWall/
├── backend/                 # NestJS Backend
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── users/          # User management
│   │   ├── organizations/  # Organization management
│   │   ├── projects/       # Project management
│   │   ├── tasks/          # Task management
│   │   ├── time/           # Time tracking
│   │   ├── reports/        # Reporting & analytics
│   │   └── prisma/         # Database service
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   └── seed.ts         # Seed data
│   └── package.json
│
├── frontend/               # React Frontend
│   ├── src/
│   │   ├── api/           # API client functions
│   │   ├── components/    # Reusable components
│   │   ├── layouts/       # Layout components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Zustand stores
│   │   ├── App.tsx        # Main app component
│   │   └── main.tsx       # Entry point
│   └── package.json
│
└── docker-compose.yml      # Docker orchestration
```

## 🔑 Key Features

### Authentication & Authorization
- JWT-based authentication
- Refresh token support
- Role-based access control (Admin, Manager, Member)
- Protected routes

### Organizations
- Create and manage organizations
- Add/remove team members
- Organization-level permissions

### Projects
- Create projects within organizations
- Assign team members to projects
- Track project status (Active, Completed, Archived)
- Kanban-style task boards

### Tasks
- Create, update, and delete tasks
- Assign tasks to team members
- Set priority levels (Low, Medium, High, Urgent)
- Task status tracking (Todo, In Progress, Done)
- Due date management

### Time Tracking
- Start/stop timer for tasks
- View active timers
- Time entry history
- Calculate duration automatically

### Reports & Analytics
- Monthly time reports
- Project-level analytics
- Task completion statistics
- Visual charts and graphs
- CSV export functionality

## 📊 Database Schema

### Core Tables
- **users** - User accounts and authentication
- **organizations** - Organization entities
- **organization_users** - User-organization relationships
- **projects** - Projects within organizations
- **project_members** - Project team members
- **tasks** - Tasks within projects
- **time_entries** - Time tracking records

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- HTTP-only cookies support
- CORS configuration
- Input validation with class-validator
- SQL injection protection via Prisma
- XSS protection
- Rate limiting (configurable)

## 📝 API Documentation

Once the backend is running, access the Swagger documentation at:
```
http://localhost:3001/api
```

## 🧪 Testing

### Backend Tests
```bash
cd backend

# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Frontend Tests
```bash
cd frontend

# Run tests
npm run test
```

## 🚢 Deployment

### Frontend Deployment (Vercel)

```bash
cd frontend
npm run build

# Deploy to Vercel
vercel --prod
```

### Backend Deployment (Render/Railway)

1. Push your code to GitHub
2. Connect your repository to Render or Railway
3. Set environment variables
4. Deploy

### Database (Supabase or Neon)

1. Create a PostgreSQL database on Supabase or Neon
2. Update DATABASE_URL in your environment
3. Run migrations: `npx prisma migrate deploy`

## 🛠️ Development

### Running in Development Mode

```bash
# Terminal 1 - Backend
cd backend
npm run start:dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Database Management

```bash
# Open Prisma Studio
npm run prisma:studio

# Create a new migration
npm run prisma:migrate

# Reset database
npx prisma migrate reset
```

## 📈 Performance Optimizations

- React Query for efficient data fetching and caching
- Lazy loading of routes
- Image optimization
- Database indexes on foreign keys
- Connection pooling
- API response caching

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 👨‍💻 Author

Built with ❤️ by the BoardWall Team

## 🐛 Known Issues

None at the moment. Please report any bugs via GitHub Issues.

## 🗺️ Roadmap

- [ ] Real-time notifications via WebSockets
- [ ] Email notifications
- [ ] Calendar integration
- [ ] Mobile app (React Native)
- [ ] Dark mode
- [ ] Multi-language support
- [ ] Advanced reporting features
- [ ] Integrations (Slack, Discord, etc.)

## 📞 Support

For support, email support@boardwall.com or join our Discord community.

---

**Happy Task Management! 🎉**