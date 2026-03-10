---
description: 'Project-wide development rules for a RedwoodJS v8.8 full-stack Task Manager application using Cells, GraphQL services, Prisma, TailwindCSS, and shadcn/ui'
alwaysApply: true
---

This repository is a **RedwoodJS v8.8 full-stack application**.

The AI assistant must strictly follow RedwoodJS architecture and conventions.

Official documentation:
https://docs.redwoodjs.com/docs/introduction/

---

# Core Architecture Rules

This project follows the RedwoodJS full-stack architecture:

Frontend:
web/

- src/pages
- src/components
- src/cells
- src/layouts
- src/lib

Backend:
api/

- src/graphql (SDL)
- src/directives
- src/graphql
- src/lib
- src/services
- src/providers
- db (Prisma)

AI must NEVER break this architecture.

---

# Redwood Data Flow

The correct data flow must always be:

Database (Prisma)
→ GraphQL SDL
→ Service
→ Cell
→ Component/UI

Never bypass this flow.

Examples of forbidden patterns:

❌ Fetching Prisma directly from frontend
❌ Putting business logic in React components
❌ Writing GraphQL logic inside UI components

---

# Use Redwood Generators

Always prefer Redwood generators.

Examples:

yarn rw g page
yarn rw g cell
yarn rw g scaffold
yarn rw g service
yarn rw g sdl

Never manually recreate generator output unless necessary.

---

# Cells for Data Fetching

Frontend data fetching must use **Redwood Cells** whenever possible.

Cells must handle:

- Loading state
- Empty state
- Failure state
- Success state

Avoid calling GraphQL directly inside components.

---

# GraphQL API Rules

GraphQL implementation must follow:

SDL defines schema
Services implement logic

Example structure:

api/src/graphql/tasks.sdl.ts
api/src/services/tasks/tasks.ts

---

# Prisma Rules

Database schema lives in:

api/db/schema.prisma

Before creating new models or relations:

1. Check existing models
2. Reuse relations if possible
3. Follow existing naming conventions

---

# UI Rules

UI must follow:

- shadcn/ui components
- TailwindCSS
- responsive layout
- reusable components

Avoid custom CSS when Tailwind utilities exist.

---

# Component Design Rules

Components must be:

- small
- reusable
- modular

Avoid very large components.

---

# State Management

Prefer:

- Redwood Cells
- React local state

Avoid unnecessary global state.

---

# Authentication

Authentication uses:

Redwood **dbAuth**

Located in:

api/src/functions/auth.ts

Do not replace or bypass the existing authentication system.

---

# Code Quality

Always:

- use clear variable names
- avoid duplicated logic
- follow Redwood naming conventions
- write readable code

---

# Implementation Workflow

When implementing a feature:

1. Understand the requirement
2. Identify required models / services / cells
3. Suggest Redwood generators
4. Implement backend first
5. Implement frontend
6. Connect through Cells

Never skip architecture planning.

---

# When Unsure

If unsure about implementation:

1. Check Redwood documentation
2. Follow existing code patterns in the repo
3. Prefer Redwood generators

Never invent custom architecture.
