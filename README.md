# Manage Vehicle Backend

A Node.js backend API for managing driver timelines and schedules. Built with Express.js, Prisma ORM, and SQLite database.

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite
- **ORM**: Prisma
- **Validation**: jsonschema
- **Package Manager**: npm

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Database

```bash
# Push Prisma schema to database
npm run db:push

# Seed the database with sample data
node seed.js
```

### 3. Start the Server

```bash
npm start
```

The server will start on `http://localhost:3001`

### Available Scripts

```bash
npm start          # Start the server
npm run dev        # Start with nodemon (if configured)
npm run db:push    # Push Prisma schema changes
npm run db:studio  # Open Prisma Studio (if available)
```

### Database Operations

```bash
# Generate Prisma client after schema changes
npx prisma generate

# Push schema changes to database
npx prisma db push

# Open Prisma Studio for database inspection
npx prisma studio
```

### Seeding Database

```bash
# Clear and populate database with sample data
node seed.js
```
