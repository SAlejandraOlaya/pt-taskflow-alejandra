# TaskFlow — Agent Instructions

## What Is This

TaskFlow is a single-page task management app for the Orquestia frontend developer assessment. It consumes the DummyJSON public API for CRUD operations on todos.

## Stack

Next.js 15 (App Router) · React 19 · TypeScript (strict) · TailwindCSS · shadcn/ui · pnpm

## Critical Context

DummyJSON write endpoints (POST, PUT/PATCH, DELETE) simulate success but do NOT persist data on the server. All mutations must be reflected in local state. This is the single most important architectural constraint.

## Project Structure

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx            ← Single SPA route
│   └── globals.css
├── components/
│   ├── ui/                 ← shadcn/ui primitives
│   ├── TodoItem.tsx
│   ├── AddTodoForm.tsx
│   ├── FilterTabs.tsx
│   ├── Pagination.tsx
│   ├── EmptyState.tsx
│   ├── ErrorState.tsx
│   └── TodoSkeleton.tsx
├── hooks/
│   └── useTodos.ts         ← ALL fetching + state logic
├── lib/
│   ├── api.ts              ← API client wrapper
│   └── utils.ts            ← cn() helper
└── types/
    └── todo.ts             ← TypeScript interfaces
```

## Build & Run

```bash
pnpm install
pnpm dev          # localhost:3000
pnpm build        # MUST complete with zero lint errors
pnpm lint
```

## Environment

```
NEXT_PUBLIC_API_URL=https://dummyjson.com
```

## Features

1. Paginated todo list (10/page) with loading skeletons and error+retry
2. Create todo → POST /todos/add → add to local state
3. Toggle completed → PATCH /todos/{id} → optimistic update with rollback
4. Delete todo → DELETE /todos/{id} → confirm first, remove on success
5. Local filter: All / Completed / Pending (no extra API calls)

## Code Rules

- Fetching logic in custom hooks only — never in components
- TypeScript types for all API responses — no `any`
- At least two reusable components
- ESLint + Prettier configured and passing
- Conventional git commits, one per feature minimum

## Evaluation Criteria

They will judge: React/TS/Tailwind usage, component quality, code readability, responsible AI usage, justified decisions, gitflow, documentation.

They will NOT judge: perfect design, complex architecture, forced animations, testing (optional plus).
