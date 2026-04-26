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

- **Framework**: Tanstack Start, React 19, Tailwind CSS v4.
- **Language**: TypeScript. Use `tsconfig.json` paths if applicable.
- **Formatting**: ALWAYS run `bun run lint` before finishing.
- **Components**: Functional components + Hooks. Use Server Components by default in `app/`.
- **Styling**: Tailwind CSS utility classes.
- **State**: Use `useId`, `use`, `useOptimistic`, `useTransition` where appropriate (React 19).
- **TypeScript Props**: When extending native HTML elements, use `ComponentProps<"element">` (e.g., `ComponentProps<"input">`) instead of `React.InputHTMLAttributes<HTMLInputElement>`.

## Specific Rules

- Use App Router and Server Components (minimize client-side JS).
- Use `use` hook for data fetching; Server Actions for mutations.
- Implement Metadata API for SEO.
- Follow React 19/Next.js best practices for streaming and suspense.

<!-- convex-ai-start -->

This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read `convex/_generated/ai/guidelines.md` first** for important guidelines on how to correctly use Convex APIs and patterns. The file contains rules that override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running `npx convex ai-files install`.

<!-- convex-ai-end -->
