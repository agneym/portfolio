# Agent Instructions

- Use context7 when library/API documentation, code generation, setup or configuration steps without me having to explicitly ask: `bunx ctx7` for cli

## Commands

- **Dependency Management**: Use `mise` to manage Node.js, Ruby, Bun, and other runtime versions. The project uses `mise.toml` for version configuration.
- **Install**: `bun install`
- **Build**: `bun run build` (Next.js build)
- **Lint**: `bun run lint` (Oxlint with type-aware checking)
- **Format**: `bun run format` (Oxfmt)
- **Test**: No tests currently exist in the repository.

## Code Style & Conventions

- **Framework**: Next.js 16 (App Router), React 19, Tailwind CSS v4.
- **Language**: TypeScript. Use `tsconfig.json` paths if applicable.
- **Formatting**: ALWAYS run `bun run lint` before finishing.
- **Components**: Functional components + Hooks. Use Server Components by default in `app/`.
- **Styling**: Tailwind CSS utility classes.
- **State**: Use `useId`, `use`, `useOptimistic`, `useTransition` where appropriate (React 19).
- **TypeScript Props**: When extending native HTML elements, use `ComponentProps<"element">` (e.g., `ComponentProps<"input">`) instead of `React.InputHTMLAttributes<HTMLInputElement>`.

## Specific Rules

- Use App Router and Server Components (minimize client-side JS).
- Use `use` hook for data fetching; Server Actions for mutations.
- Use `next/image` and `next/link`.
- Implement Metadata API for SEO.
- Follow React 19/Next.js best practices for streaming and suspense.
