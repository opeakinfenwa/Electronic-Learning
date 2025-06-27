![MIT License](https://img.shields.io/badge/license-MIT-green)

## Modular Electronic Learning System

This project is a modular, scalable, and extensible backend system built for managing an electronic learning platform. It is implemented using **full Express.js**, **Prisma ORM**, and **PostgreSQL**, with enhanced support for migrations and seeders using handcrafted runners to enable both forward and rollback capabilities.

## Architecture Overview

The system is organized into clearly defined modules that ensure maintainability, scalability, and ease of development:

* **User Module** – Manages user accounts, roles, and profiles.
* **Auth Module** – Provides both local and Google OAuth based authentication.
* **Course Module** – Handles course creation, updates, and publishing.
* **Enrollment Module** – Manages course enrollment logic with user course relationships.
* **Lesson Module** – Handles the management and retrieval of course lessons.

## Database Strategy with Prisma (PostgreSQL)

#### Prisma + Raw SQL for Precision

While Prisma is used for modeling and database client access, the project enhances its capabilities with custom SQL based migration and seeder logic:

* Prisma schema used for model definitions and generating the client
* Raw SQL for full control over data migrations and seed logic

#### Custom Migration System

The project includes a handcrafted migration system that:

* Stores `up/` and `down/` SQL files under `prisma/migrations/`
* Logs history to `migration-history.json`
* Ensures atomic rollback on failure

```bash
npm run migrate     # Applies all new migrations
npm run rollback    # Rolls back the latest migration
```

### Seed System

A structured seeder system includes:

* `sql/` and `undo/` folders for seeding and undoing test/dev data
* Seeder log tracking via `seeder-history.json`

```bash
npm run seed        # Runs all seed scripts
npm run seed:undo   # Reverts the most recent seed
```

## Features by Module

#### User Module

* Manages users and their roles (e.g., student, instructor, admin)
* User profile details like bio, title, and timestamps
* Linked to courses and enrollments

#### Auth Module

* Supports both local (email/password) and Google OAuth authentication
* Secure session/token management via JWT
* Password reset and update flows

#### Course Module

* Instructors can create and manage courses
* Each course can have multiple lessons and enrollments
* Relationships:

  * Course `belongsTo` User (Instructor)
  * Course `hasMany` Lessons

#### Enrollment Module

* Users can enroll in available courses
* Prevents duplicate enrollments
* Tracks course progress (optional future enhancement)

#### Lesson Module

* Lessons are tied to a course
* Tracks content, order, and timestamps
* Optional: multimedia or assessment support

## Prisma Schema Relationships

* **User** ←→ **Course** (1\:N)
* **User** ←→ **Enrollment** (1\:N)
* **Course** ←→ **Lesson** (1\:N)
* **Course** ←→ **Enrollment** (1\:N)

## Engineering Principles & Efficiencies

* **Prisma for ORM access**, refined with raw SQL migration/seed scripts
* **Custom Migration/Seed Runners** with rollback and version tracking
* **Authentication Flexibility** via local + Google OAuth
* **Strict File Structure** for migrations, seeders, and logs

## Getting Started

#### Requirements

* Node.js (v18+ recommended)
* PostgreSQL (v14+)

#### Environment Variables 

```env
DATABASE_URL=...
DATABASE_URL_TEST=...
DATABASE_URL_PROD=...
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=... 
GOOGLE_CLIENT_SECRET=...
```

#### Install & Run

```bash
npm install

# Start the server in development & Generate prisma client
npx run dev

# Apply schema migrations
npm run migrate

# Seed initial data
npm run seed
```

## Project Structure

```plaintext
src/
├── config
├── controller
├── errors
├── middlewares
├── services
└── routes
prisma/
├── migrations/
│   ├── up/
│   ├── down/
│   ├── migration-runner.ts
│   └── migration-history.json
├── seeders/
│   ├── sql/
│   ├── undo/
│   ├── seed-runner.ts
│   └── seeder-history.json
```

## Future Improvements

* Add media uploads to lesson content
* User course progress tracking
* Swagger or Redoc API docs
* Add Redis for caching
* Enhanced Google OAuth flow with consent screen

## Acknowledgements

Built to demonstrate deep understanding of modular backend architecture using Express, advanced ORM usage with Prisma, and complex relational database modeling. Showcases mastery in implementing secure authentication flows, structured migration and seeding systems, and role based user course relationships in a scalable PostgreSQL environment.

## License

This project is licensed under the MIT License
