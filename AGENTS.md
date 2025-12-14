# Agent Instructions

## Commands

- **Install**: `bun install`
- **Build**: `bun run build` (Next.js build)
- **Lint**: `bun run lint` (ESLint)
- **Format**: `bun run format` (Prettier + Import Sorting)
- **Test**: No tests currently exist in the repository.

## Code Style & Conventions

- **Framework**: Next.js 16 (App Router), React 19, Tailwind CSS v4.
- **Language**: JavaScript. Use `jsconfig.json` paths if applicable.
- **Formatting**: ALWAYS run `bun run format` before finishing. Prettier handles styling and import sorting.
- **Components**: Functional components + Hooks. Use Server Components by default in `app/`.
- **Styling**: Tailwind CSS utility classes.
- **State**: Use `useId`, `use`, `useOptimistic`, `useTransition` where appropriate (React 19).
- **TypeScript Props**: When extending native HTML elements, use `ComponentProps<"element">` (e.g., `ComponentProps<"input">`) instead of `React.InputHTMLAttributes<HTMLInputElement>`.

## Specific Rules (from Copilot Instructions)

- Use App Router and Server Components (minimize client-side JS).
- Use `use` hook for data fetching; Server Actions for mutations.
- Use `next/image` and `next/link`.
- Implement Metadata API for SEO.
- Follow React 19/Next.js best practices for streaming and suspense.
