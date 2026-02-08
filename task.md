You are a senior full-stack engineer building a production-ready SaaS MVP.

Build a project called BoardWall — a Smart Task, Time Tracking, and Reporting System for small teams.

This is NOT a tutorial project. It must follow real-world architecture.

🎯 Tech Stack (MANDATORY)

Frontend:

React + Vite

TypeScript

Tailwind CSS

React Query

React Hook Form

Zustand (state)

Recharts (analytics)

Backend:

NestJS (Node.js + TypeScript)

Prisma ORM

JWT + Refresh Tokens

bcrypt for password hashing

Swagger API docs

Database:

PostgreSQL

DevOps:

Docker + docker-compose

Seed data

Environment variables

ESLint + Prettier

Deployment targets:

Frontend: Vercel

Backend: Render

DB: Supabase or Neon

🧠 Core System Requirements
Authentication

Register

Login

Refresh token

Logout

Password reset

Role-based access (Admin / Manager / Member)

Organizations

Users belong to organizations.

Tables:

organizations

organization_users

Projects

Create/update/delete projects

Assign members

Tasks

Fields:

title

description

status (todo / in_progress / done)

priority

due_date

assignee_id

Time Tracking

Users can start/stop timer per task.

Stored in:

time_entries

Reporting Dashboard

Monthly analytics:

Total hours per user

Tasks completed

Project progress %

Visualized using charts.

CSV export.

🧱 Required Database Schema (Prisma)

users
organizations
organization_users
projects
project_members
tasks
time_entries
roles

Include indexes and foreign keys.

🔐 Permissions

Admins:

manage users

manage projects

Managers:

manage tasks

Members:

view assigned tasks only

Use NestJS Guards.

🧩 Backend Architecture

NestJS modules:

auth
users
organizations
projects
tasks
time
reports

Use:

DTOs

Services

Controllers

Guards

Interceptors

Provide folder structure.

🎨 Frontend Architecture

React folders:

/api
/components
/pages
/layouts
/hooks
/store
/utils

Pages:

Login

Register

Dashboard

Projects

Tasks

Reports

Settings

Protected routes.

🐳 Docker

Provide:

docker-compose.yml

Services:

postgres

backend

frontend

📄 Deliverables

Full backend code

Full frontend code

Prisma schema

SQL migrations

API documentation

Seed scripts

ENV examples

README.md with setup instructions

Deployment guide

Sample screenshots

⚠️ Rules

TypeScript everywhere

No shortcuts

No pseudo-code

Production patterns only

Use pagination

Use transactions

Use validation pipes

Use centralized error handling

Explain architectural decisions.

Build step-by-step.

Start with backend.