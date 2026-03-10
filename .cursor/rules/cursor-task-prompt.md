---
description: 'Reusable task prompt template for implementing new RedwoodJS features with proper architecture planning, generators, backend services, Cells, and responsive UI'
alwaysApply: false
---

# Feature Implementation Prompt

You are a senior RedwoodJS full-stack developer.

Your task is to implement a feature in this RedwoodJS project.

You must strictly follow:

- RedwoodJS architecture
- the rules in `cursor-rules.md`

---

# Development Process

You MUST follow this workflow:

1️⃣ Analyze the feature
2️⃣ Propose architecture changes
3️⃣ Suggest Redwood generators
4️⃣ Implement backend
5️⃣ Implement frontend
6️⃣ Connect using Cells

Never skip steps.

---

# Architecture Rules

Correct data flow:

Prisma
→ GraphQL SDL
→ Service
→ Cell
→ UI Component

Never bypass this architecture.

---

# Code Generation Rules

Prefer Redwood generators.

Examples:

yarn rw g page
yarn rw g cell
yarn rw g scaffold
yarn rw g service

---

# Backend Rules

Backend logic must live in:

api/src/services

GraphQL schema must live in:

api/src/graphql

Never implement business logic inside UI components.

---

# Frontend Rules

Frontend data fetching must use **Cells**.

Cells must implement:

- Loading
- Empty
- Failure
- Success states

---

# UI Rules

Use:

- shadcn/ui
- TailwindCSS
- reusable components

Avoid unnecessary custom CSS.

---

# Feature Request

Implement the following feature:

[Describe the feature here]

---

# Output Format

Your response must include:

1️⃣ Architecture explanation
2️⃣ Required generators
3️⃣ Backend implementation
4️⃣ Frontend implementation
5️⃣ Integration with Cells
