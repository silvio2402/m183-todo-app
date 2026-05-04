# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
# Start the PostgreSQL database (required before running the app)
docker-compose up -d

# Install dependencies
npm install

# Push Prisma schema to the database (after schema changes)
npx prisma db push

# Generate Prisma client (after schema changes)
npx prisma generate

# Development server
npm run dev

# Production build and start
npm run build && npm run start

# Lint
npm run lint
```

There are no automated tests in this project.

## Architecture

**Next.js 16 App Router** with server components as the default. The app uses `src/app/` as the root, with `@/` aliased to `src/`.

### Data flow

- **Server components** (e.g., `src/app/page.tsx`) fetch data directly from Prisma and pass it as props to client components.
- **Server Actions** (`src/app/actions/task.ts`) handle all mutations (create, update, delete). Every action verifies the session via `getServerSession` and scopes DB queries to `userId` to prevent IDOR. Actions call `revalidatePath("/")` to trigger re-render.
- **Client components** use TanStack React Query `useMutation` for optimistic UI updates — they update local state in `onMutate` and call the server action as `mutationFn`. No invalidation/refetch is used; the server revalidation from the action drives the next full update.

### Auth

NextAuth.js (`next-auth@4`) with a Credentials provider. Config lives in `src/lib/auth.ts`; the catch-all API route is at `src/app/api/auth/[...nextauth]/route.ts`. JWT strategy with `HttpOnly` cookies. The JWT callback adds `token.id`, and the session callback exposes `session.user.id`. TypeScript augmentation for the extra `id` field is in `src/types/next-auth.d.ts`.

Registration is a plain API route at `src/app/api/auth/register/route.ts` (POST). Passwords are hashed with bcryptjs (cost factor 10).

### Database

Prisma ORM with PostgreSQL. Singleton client in `src/lib/db.ts` (re-used across hot reloads in dev via `global`). Schema at `prisma/schema.prisma` — two models: `User` (id, username, password) and `Task` (id, title, state, userId).

Task `state` is a plain string with the values `"open"`, `"in progress"`, `"done"` (enforced only in the UI, not at the DB level).

### Client-side providers

`src/app/providers.tsx` wraps the app with `SessionProvider` (NextAuth) and `QueryClientProvider` (TanStack React Query). Mounted in `src/app/layout.tsx`.

### Search

URL-driven: the `q` query param filters tasks server-side via a Prisma `contains` (case-insensitive) query. The `Search` client component debounces input (300 ms) and uses `router.replace` to update the URL. Wrapped in `<Suspense>` in the home page because it calls `useSearchParams()`.

### Key conventions

- All server actions and API routes authenticate before touching the DB — never trust client-supplied user IDs.
- Prisma queries always include `userId` in `where` clauses on Task to scope results to the logged-in user.
- Before writing any Next.js-specific code, read the relevant guide under `node_modules/next/dist/docs/` — this project is on Next.js 16 which may differ from training data.
