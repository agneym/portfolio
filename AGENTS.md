# Agent Instructions

Personal portfolio and blog for Agney Menon.

- Use context7 for library/API documentation, code generation, and setup or configuration steps without being asked.
- Follow [DESIGN.md](./DESIGN.md) for visual design and UI decisions.
- You run under `hc` (herdr-core): use it to spawn agents, read their output, and steer them. Run `hc --skill` for usage.

## Context7 Library IDs

- **TanStack Start**: `/websites/tanstack_start_framework_react`
- **TanStack Router**: `/tanstack/router`
- **TanStack Query**: `/websites/tanstack_query`
- **React**: `/websites/react_dev`
- **Tailwind CSS**: `/websites/tailwindcss`
- **Rsbuild**: `/web-infra-dev/rsbuild`
- **Content Collections**: `/sdorra/content-collections`
- **Shiki**: `/shikijs/shiki`
- **Oxc (oxlint, oxfmt)**: `/websites/oxc_rs`

## Stack

- **Framework**: TanStack Start (React 19, TanStack Router, TanStack Query) on Rsbuild 2 (Rspack).
- **Styling**: Tailwind CSS v4 (via `@tailwindcss/postcss`).
- **Content**: MDX blog posts via Content Collections (`content-collections.ts`, driven by an inline plugin in `rsbuild.config.ts`), code highlighting with Shiki.
- **Tooling**: oxlint (type-aware) and oxfmt; `mise` manages runtimes (`mise.toml`, Node 26.13.1); bun is the package manager.
- **Git hooks**: lefthook pre-commit runs `oxfmt` and `oxlint --fix` on staged files.

## Commands

Scripts are defined in `package.json`.

- Bundle analysis: `RSDOCTOR=true bun run build` emits `rsdoctor-data.json` (see the `rsdoctor-analysis` skill).
- There are no tests.

## Project Structure

- `src/app/`: file-based routes (`routesDirectory: "app"`), plus `__root.tsx`, `client.tsx`, `server.ts`, `providers.tsx`, and `global.css`
- `src/app/blog/posts/*.mdx`: blog posts (Content Collections `posts` collection)
- `src/components/`: UI components (`HomePage`, `BlogHome`, `Webmarks`, `uikit`, `shared`, `mdx.tsx`)
- `src/webmarks/`: webmarks (bookmarks) server functions and query options
- `src/images/`: SVGs and images (SVGs import as components via `@rsbuild/plugin-svgr` with `?react`)
- `src/router.tsx`: router and React Query setup
- `src/routeTree.gen.ts`: generated, do not edit
- `public/`: static assets

Path aliases: `components`, `images`, `webmarks` resolve to `src/*` (Rsbuild + tsconfig); generated content is imported from `content-collections`.

## Code Style & Conventions

- TypeScript throughout.
- Functional components + hooks.
- Style with Tailwind CSS utility classes.
- When extending native HTML elements, use `ComponentProps<"element">` (e.g. `ComponentProps<"input">`) instead of `React.InputHTMLAttributes<HTMLInputElement>`.
