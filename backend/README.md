# BoardWall Backend API

Production-ready NestJS backend for BoardWall Task Management System.

## Tech Stack

- NestJS (Node.js + TypeScript)
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Swagger API Documentation
- Docker

## Prerequisites

- Node.js 20+
- PostgreSQL 16+
- npm or yarn

## Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Update .env with your database credentials
```

## Database Setup

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database with demo data
npx prisma db seed
```

## Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

## API Documentation

Once the server is running, visit `http://localhost:3001/api` to view the Swagger API documentation.

## Project Structure

```
src/
├── auth/           # Authentication module (JWT, Guards, Strategies)
├── users/          # User management
├── organizations/  # Organization management
├── projects/       # Project management
├── tasks/          # Task management
├── time/           # Time tracking
├── reports/        # Reporting and analytics
├── prisma/         # Database service
├── app.module.ts   # Root module
└── main.ts         # Application entry point
```

## Database Schema

- **users** - User accounts and authentication
- **organizations** - Organization entities
- **organization_users** - Many-to-many relationship between users and organizations
- **projects** - Projects within organizations
- **project_members** - Project team members
- **tasks** - Tasks within projects
- **time_entries** - Time tracking records

## API Endpoints

### Authentication
- POST /auth/register - Register new user
- POST /auth/login - Login user
- GET /auth/profile - Get current user profile

### Organizations
- POST /organizations - Create organization
- GET /organizations - List user's organizations
- GET /organizations/:id - Get organization details
- PUT /organizations/:id - Update organization
- DELETE /organizations/:id - Delete organization
- POST /organizations/:id/members - Add member
- DELETE /organizations/:id/members/:userId - Remove member

### Projects
- POST /projects - Create project
- GET /projects - List projects
- GET /projects/:id - Get project details
- PUT /projects/:id - Update project
- DELETE /projects/:id - Delete project

### Tasks
- POST /tasks - Create task
- GET /tasks - List tasks
- GET /tasks/:id - Get task details
- PUT /tasks/:id - Update task
- DELETE /tasks/:id - Delete task
- PUT /tasks/:id/assign - Assign task
- PUT /tasks/:id/status - Update task status

### Time Tracking
- POST /time/start - Start timer
- POST /time/stop - Stop timer
- GET /time/active - Get active timer
- GET /time/entries - Get time entries

### Reports
- GET /reports/monthly - Get monthly report
- GET /reports/project - Get project report
- GET /reports/export/csv - Export to CSV

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Environment Variables

See `.env.example` for all required environment variables.

## License

MIT