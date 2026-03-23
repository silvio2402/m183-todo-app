# Secure Todo App

A complete, secure-by-default rewrite of the M183 Todo application.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Database**: PostgreSQL (via Docker)
- **ORM**: Prisma (protects against SQL Injection)
- **Auth**: NextAuth.js (protects against Session Forgery with secure HttpOnly JWT cookies)
- **Styling**: Tailwind CSS
- **State Management**: Tanstack React Query (for optimistic, flicker-free UI updates)

## Prerequisites
- Node.js 18+ and npm
- Docker & Docker Compose

## Quick Start

1. **Start the database**
   Spin up the required PostgreSQL database instance in the background:
   ```bash
   docker-compose up -d
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   The application requires a `.env` file for the database connection and JWT session encryption.
   Create a `.env` file in the root of the project with the following contents:
   ```env
   DATABASE_URL="postgresql://todo_user:secure_todo_password@localhost:5432/secure_todo_app?schema=public"
   NEXTAUTH_SECRET="a-very-secure-random-string-with-at-least-32-chars"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Initialize the Database**
   Push the Prisma schema to the running database to create the necessary tables:
   ```bash
   npx prisma db push
   ```

5. **Run the Application**
   Start the Next.js development server:
   ```bash
   npm run dev
   ```
   Or, build and start it for production:
   ```bash
   npm run build
   npm run start
   ```

6. **Usage**
   Open `http://localhost:3000` in your browser. Register a new account, log in, and securely manage your tasks!
