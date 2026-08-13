# URL Shortener — Code Alpha Internship Task 1

> A simple, full-stack URL shortener built with **Node.js**, **Express**, **TypeScript**, **Prisma** and **React**. Turn long, unwieldy links into short, shareable codes and track how many times they are clicked.

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)](https://expressjs.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev)
[![SQLite](https://img.shields.io/badge/SQLite-003B57?logo=sqlite&logoColor=white)](https://www.sqlite.org)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Set Up the Backend](#2-set-up-the-backend)
  - [3. Set Up the Frontend](#3-set-up-the-frontend)
- [API Reference](#api-reference)
  - [Health Check](#health-check)
  - [Create a Short URL](#create-a-short-url)
  - [Redirect to the Original URL](#redirect-to-the-original-url)
- [Error Handling](#error-handling)
- [Data Model](#data-model)
- [Validation](#validation)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Shorten URLs** — submit a long URL and receive a short, unique 6-character code.
- **Instant redirects** — visiting `/{code}` redirects (HTTP `302`) to the original URL.
- **Click tracking** — every redirect increments the click counter for that URL.
- **Unique codes** — codes are generated using a cryptographically secure random generator and collision-checked against the database.
- **Full-stack validation** — URLs are validated on the **client** (React) and **server** (Zod) with consistent, user-friendly error messages.
- **Structured error handling** — centralized error and 404 handlers return consistent JSON responses.
- **CORS enabled** — the API is safely exposed to the frontend development server.
- **Type-safe end to end** — TypeScript on both backend and frontend.

---

## Tech Stack

| Layer      | Technology                                              |
| ---------- | ------------------------------------------------------- |
| Backend    | Node.js, Express 5, TypeScript                          |
| Validation | Zod                                                     |
| ORM / DB   | Prisma 7 with the better-sqlite3 driver adapter, SQLite |
| Frontend   | React 19, TypeScript, Vite 8                            |
| Tooling    | `tsx` for development hot-reload, ESLint, Prisma CLI    |

---

## Project Structure

```text
.
├── client/                    # React frontend (Vite)
│   ├── src/
│   │   ├── App.tsx            # Main UI: shorten, copy, error display
│   │   ├── main.tsx
│   │   └── index.css          # Global styles
│   └── vite.config.ts
│
├── src/                       # Express backend
│   ├── app.ts                 # App setup: middleware, routes, handlers
│   ├── server.ts              # Entry point (port 3000)
│   ├── routes/
│   │   ├── url.routes.ts      # POST /api/urls
│   │   └── redirect.routes.ts # GET /:code
│   ├── controllers/
│   │   └── url.controller.ts  # Request/response logic
│   ├── services/
│   │   └── url.service.ts     # Database operations
│   ├── validators/
│   │   └── url.validator.ts   # Zod schema
│   ├── middleware/
│   │   ├── validate.ts        # Schema validation middleware
│   │   ├── asyncHandler.ts    # Async error wrapper
│   │   ├── errorHandler.ts    # Central error handler
│   │   └── notFound.ts        # 404 handler
│   ├── errors/
│   │   └── AppError.ts        # Custom error class
│   ├── utils/
│   │   └── generateCode.ts    # Secure short-code generator
│   └── lib/
│       └── prisma.ts          # Prisma client (SQLite adapter)
│
├── prisma/
│   ├── schema.prisma          # Url model
│   ├── migrations/            # SQL migration history
│   └── dev.db                 # SQLite database (dev)
│
└── package.json
```

---

## Getting Started

### Prerequisites

- **Node.js** 18 or newer
- **npm** (bundled with Node.js)

### 1. Clone the Repository

```bash
git clone https://github.com/Shambel96/CodeAlpha_Simple-URL-Shorter.git
cd CodeAlpha_Simple-URL-Shorter
```

### 2. Set Up the Backend

```bash
# Install backend dependencies
npm install

# Create the environment file from the example
cp .env.example .env
```

`.env` — set the SQLite connection string:

```env
DATABASE_URL="file:./prisma/dev.db"
```

> Note: `.env` is gitignored. If no `.env.example` exists in your clone, create `.env` manually with the `DATABASE_URL` above.

```bash
# Generate the Prisma Client
npx prisma generate

# Apply the database schema (dev.db)
npx prisma migrate dev

# Start the development server on http://localhost:3000
npm run dev
```

The API will be available at `http://localhost:3000`.

### 3. Set Up the Frontend

Open a second terminal:

```bash
# Install frontend dependencies
cd client
npm install

# Start the Vite dev server
npm run dev
```

The frontend runs on **http://localhost:5174** (the backend CORS policy allows this origin). Open it in your browser, paste a URL, and hit **Shorten URL**.

> If your Vite server binds to a different port, update `origin` in `src/app.ts` (CORS) to match.

---

## API Reference

Base URL: `http://localhost:3000`

### Health Check

Check that the API is running.

```http
GET /
```

**Response `200`**

```json
{
  "message": "URL Shortener API is running"
}
```

### Create a Short URL

```http
POST /api/urls
Content-Type: application/json
```

**Request body**

| Field | Type   | Required | Description        |
| ----- | ------ | -------- | ------------------ |
| `url` | string | Yes      | The URL to shorten |

**Example request**

```bash
curl -X POST http://localhost:3000/api/urls \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com/very/long/path"}'
```

**Response `201 Created`**

```json
{
  "data": {
    "id": 1,
    "code": "aB3xZ9",
    "originalUrl": "https://example.com/very/long/path",
    "clicks": 0,
    "createdAt": "2026-08-14T00:00:00.000Z",
    "updatedAt": "2026-08-14T00:00:00.000Z"
  }
}
```

**Response `400 Bad Request`** (invalid URL)

```json
{
  "message": "Validation failed",
  "errors": [
    {
      "code": "invalid_url",
      "message": "Please provide a valid URL"
    }
  ]
}
```

Your shortened link is `http://localhost:3000/aB3xZ9`.

### Redirect to the Original URL

```http
GET /:code
```

Visiting a short code redirects to the original URL and increments its click counter.

**Example**

```bash
curl -I http://localhost:3000/aB3xZ9
```

**Response `302 Found`**

```
Location: https://example.com/very/long/path
```

**Response `404 Not Found`** (unknown code)

```json
{
  "message": "Short URL not found"
}
```

---

## Error Handling

The API uses a centralized error-handling pipeline for consistent, predictable responses.

| Scenario                    | Status | Response body                                                    |
| --------------------------- | ------ | ---------------------------------------------------------------- |
| Invalid/missing URL         | `400`  | `{ "message": "Validation failed", "errors": [...] }`            |
| Short URL not found         | `404`  | `{ "message": "Short URL not found" }`                           |
| Unknown route               | `404`  | `{ "message": "Route <METHOD> <path> not found" }`               |
| Unique constraint violation | `409`  | `{ "message": "A resource with the same value already exists" }` |
| Unexpected error            | `500`  | `{ "message": "Internal server error" }`                         |

---

## Data Model

Defined in `prisma/schema.prisma`:

```prisma
model Url {
  id          Int      @id @default(autoincrement())
  code        String   @unique
  originalUrl String
  clicks      Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

| Column        | Type       | Notes                                 |
| ------------- | ---------- | ------------------------------------- |
| `id`          | `Int`      | Primary key, auto-increments          |
| `code`        | `String`   | Unique 6-character short code         |
| `originalUrl` | `String`   | The long URL being shortened          |
| `clicks`      | `Int`      | Number of redirects (defaults to `0`) |
| `createdAt`   | `DateTime` | Timestamp of creation                 |
| `updatedAt`   | `DateTime` | Auto-updated on every change          |

---

## Validation

Validation is enforced on **both** sides of the stack:

- **Backend** (`src/validators/url.validator.ts`) — a Zod schema, `z.string().url("Please provide a valid URL")`, is applied through the `validate` middleware before the request reaches the controller.
- **Frontend** (`client/src/App.tsx`) — the same rule is enforced client-side before any network request, so users get immediate feedback with the identical message.

---

## Roadmap

Some ideas for the future:

- [ ] Configurable custom short codes
- [ ] URL expiration / TTL support
- [ ] Analytics dashboard (per-link click charts)
- [ ] Rate limiting and abuse protection
- [ ] QR-code generation for short links
- [ ] Docker Compose setup for one-command startup

---

## Contributing

Contributions are welcome! To get started:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feat/your-feature`.
3. Commit your changes: `git commit -m "feat: add your feature"`.
4. Push to the branch: `git push origin feat/your-feature`.
5. Open a pull request.

---

## License

This project is licensed under the ISC License.

---

<p align="center">
  Built by <a href="https://github.com/Shambel96">@Shambel96</a> · Code Alpha Internship Task 1
</p>
