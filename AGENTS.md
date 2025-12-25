# Agent Instructions

## Commands

- **Dependency Management**: Use `mise` to manage Node.js, Ruby, Bun, and other runtime versions. The project uses `mise.toml` for version configuration.
- **Install**: `bun install`
- **Dev**: `bun run dev` (Astro dev server)
- **Build**: `bun run build` (Astro build)
- **Preview**: `bun run preview` (Preview production build)
- **Lint**: `bun run lint` (ESLint)
- **Format**: `bun run format` (Prettier + Import Sorting)
- **Type checking**: `bun run typecheck` (Astro check)
- **Test**: No tests currently exist in the repository.

## Code Style & Conventions

- **Framework**: Astro 5 with React 19 integration, MDX support, Tailwind CSS v4.
- **Language**: TypeScript for `.ts` files, Astro components (`.astro`) for pages/layouts.
- **Formatting**: ALWAYS run `bun run typecheck` before finishing.
- **Components**: Prefer Astro components for static content. Use React components (in `src/components/react/`) only when client-side interactivity is needed.
- **Styling**: Tailwind CSS utility classes.
- **TypeScript Props**: When extending native HTML elements in React, use `ComponentProps<"element">` (e.g., `ComponentProps<"input">`).

## Project Structure

- `src/pages/` - File-based routing (Astro pages)
- `src/layouts/` - Astro layout components
- `src/components/` - Astro components, with `react/` subdirectory for React components
- `src/content/` - Content collections (MDX blog posts, etc.)
- `src/assets/` - Static assets processed by Astro
- `public/` - Static assets served as-is

## Astro-Specific Guidelines

- Prefer Astro components over React for static content (zero JS by default).
- Use `client:*` directives (`client:load`, `client:idle`, `client:visible`) only when React interactivity is required.
- Use Content Collections API for blog posts and structured content.
- Use `<Image />` from `astro:assets` for optimized images.
- Use frontmatter for page metadata and SEO.
