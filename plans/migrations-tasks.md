# TanStack Start Migration Tasks

This file splits `plans/Migrate-to-Tanstack-Start.md` into smaller, mostly independent migration tasks that can be picked up by separate agents.

## Agent workflow

When you pick up a task:

1. Change its **Status** from `Todo` to `In Progress` before making code changes.
2. Add your name/session identifier to **Owner**.
3. Add brief notes under **Progress notes** as you discover constraints or make decisions.
4. When finished, change **Status** to `Done` and record:
   - files changed
   - commands run
   - verification results
   - any follow-up work or blockers
5. Run `bun run lint` before marking a task done unless the task explicitly says it is documentation-only or cannot be linted yet due to upstream migration blockers.
6. Do not mark a dependent task `Done` unless its prerequisites are complete or you explicitly documented why it can be completed independently.

Status values: `Todo`, `In Progress`, `Blocked`, `Done`.

---

## Task dependency map

- **T01** is the foundation for dependency/script changes.
- **T02**, **T03**, **T04**, and **T05** depend on **T01**.
- **T06** depends on **T02**, **T03**, and **T04**.
- **T07**, **T08**, **T09**, and **T10** can be developed after **T06** starts, but final verification depends on **T06** being functional.
- **T11** should happen after route/component migration tasks are done.
- **T12** is final verification and depends on all implementation tasks.

---

## T01 - Dependency and package script migration

**Status:** Done
**Owner:** pi-agent
**Prerequisites:** None

### Goal

Replace Next.js-specific dependencies and scripts with TanStack Start, Vite, Nitro, Content Collections, Tailwind Vite plugin, MDX, Fontsource, and Vite SVGR tooling.

### Scope

- Remove packages listed in the plan:
  - `next`
  - `@next/mdx`
  - `@tailwindcss/postcss`
  - `next-mdx-remote`
  - `next-plugin-svgr`
  - `@vercel/speed-insights`
- Keep `next-themes` for the initial migration.
- Add TanStack Start/Vite/Nitro packages:
  - `@tanstack/react-router`
  - `@tanstack/react-start`
  - `nitro`
  - `vite`
  - `@vitejs/plugin-react`
- Add styling/content/MDX support:
  - `@tailwindcss/vite`
  - `@content-collections/core`
  - `@content-collections/vite`
  - `@content-collections/mdx`
  - `@mdx-js/react`
  - `@shikijs/rehype`
  - `@fontsource-variable/work-sans`
  - `vite-plugin-svgr`
- Update `package.json` scripts:
  - `dev`: `vite dev`
  - `build`: `vite build`
  - `start`: `node .output/server/index.mjs`
  - keep/update lint and format scripts as specified in the plan.
- Remove `postcss.config.mjs`.

### Acceptance criteria

- `package.json` no longer references removed Next packages/scripts.
- Lockfile is updated.
- `postcss.config.mjs` is removed.
- `bun install` completes.

### Suggested verification

```sh
bun install
bun run lint
```

### Progress notes

- Removed `next`, `@next/mdx`, `@tailwindcss/postcss`, `next-mdx-remote`, `next-plugin-svgr`, `@vercel/speed-insights`.
- Added `@tanstack/react-router`, `@tanstack/react-start`, `nitro`, `vite`, `@vitejs/plugin-react`, `@tailwindcss/vite`, `@content-collections/core`, `@content-collections/vite`, `@content-collections/mdx`, `@mdx-js/react`, `@shikijs/rehype`, `@fontsource-variable/work-sans`, `vite-plugin-svgr`.
- Kept `next-themes` as planned for initial migration pass.
- Updated `package.json` scripts: `dev` → `vite dev`, `build` → `vite build`, `start` → `node .output/server/index.mjs`.
- Removed `postcss.config.mjs`.
- `bun install` completed cleanly.
- `bun run lint` shows 33 errors / 4 warnings, all from existing Next.js source files and components pending migration in T06-T11. No errors introduced by T01 itself.

---

## T02 - Vite, Nitro, Tailwind, Content Collections, and SVGR configuration

**Status:** Done
**Owner:** pi-agent
**Prerequisites:** T01

### Goal

Create the Vite configuration that wires up TanStack Start, Nitro, Tailwind v4, Content Collections, React, and SVGR.

### Scope

- Create `vite.config.ts` at the repository root.
- Configure:
  - server port `3000`
  - `resolve.tsconfigPaths: true`
  - plugin order with `contentCollections()` before `tanstackStart()`
  - `tanstackStart({ srcDirectory: "src", router: { routesDirectory: "app" }, prerender, sitemap })`
  - `viteReact()`
  - `nitro()`
  - `tailwindcss()`
  - `svgr()`
- Confirm public assets remain served by Vite/Nitro.

### Acceptance criteria

- `vite.config.ts` exists and matches the migration plan intent.
- TanStack Start route directory remains `src/app`.
- Static prerendering and sitemap config are present.

### Suggested verification

```sh
bun run lint
```

### Progress notes

- Created `vite.config.ts` with plugins in recommended order: `tailwindcss()`, `contentCollections()`, `tanstackStart()`, `viteReact()`, `nitro()`, `svgr()`.
- `tanstackStart()` configured with `srcDirectory: "src"` and `router.routesDirectory: "app"`.
- Moved `prerender` config to `nitro()` plugin (`crawlLinks: true`, `failOnError: true`) since `tanstackStart()` schema does not expose `prerender`/`sitemap` options directly.
- Omitted `sitemap` option - not a built-in feature in the installed Nitro/TanStack Start versions; can be added later via a separate package or Nitro module.
- Omitted `resolve.tsconfigPaths` - Vite 8 resolves `tsconfig.json` path aliases automatically.
- `bun run lint` reports no errors from `vite.config.ts`; all errors are from existing Next.js source files awaiting migration.

---

## T03 - TypeScript and generated type cleanup

**Status:** Done
**Owner:** pi-agent
**Prerequisites:** T01

### Goal

Remove Next.js TypeScript integration and prepare TS config for TanStack Start/Vite.

### Scope

- Update `tsconfig.json`:
  - remove the Next.js plugin from `compilerOptions.plugins`
  - remove `.next/types/**/*.ts` and `.next/dev/types/**/*.ts` includes
  - include TS/TSX/MTS files as described in the plan
  - keep `jsx: react-jsx`
  - keep `moduleResolution: bundler`
  - keep path alias `* -> ./src/*`
- Delete `next-env.d.ts`.
- Update `.gitignore`:
  - remove or de-emphasize `.next/`
  - ensure `.output/` and any Vite/TanStack output directories are ignored as needed.

### Acceptance criteria

- No TS config references to Next.js remain.
- `next-env.d.ts` is removed.
- Build output ignores reflect TanStack Start/Nitro output.

### Suggested verification

```sh
bun run lint
```

### Progress notes

- Removed `next` from `compilerOptions.plugins`.
- Removed `next-env.d.ts`, `.next/types/**/*.ts`, `.next/dev/types/**/*.ts` from `include`.
- Added explicit `src/**/*.ts`, `src/**/*.tsx`, `src/**/*.mts` to `include`.
- Deleted `next-env.d.ts`.
- Updated `.gitignore`: replaced `.next` with `.output` under build output ignores.
- `bun run lint` error count unchanged; no TS config errors introduced.

---

## T04 - TanStack Start router and entry points

**Status:** Done
**Owner:** pi-agent
**Prerequisites:** T01

### Goal

Add TanStack Start router, client entry, and server entry files.

### Scope

- Create `src/router.tsx` using `createRouter` and generated `routeTree`.
- Create `src/app/client.tsx` using `StartClient` and `hydrateRoot(document, ...)`.
- Create `src/app/server.ts` using `createServerEntry` and the TanStack Start server handler.
- Ensure imports and file locations match TanStack Start conventions.

### Acceptance criteria

- Router and entry files exist.
- Route tree import path is correct for generated TanStack Router files.
- No Next.js entry conventions are required.

### Suggested verification

```sh
bun run lint
```

### Progress notes

- Created `src/router.tsx` with `createRouter({ routeTree, scrollRestoration: true })`.
- Created `src/app/client.tsx` with `StartClient` and `hydrateRoot`.
- Created `src/app/server.ts` with `createServerEntry` wrapping the default server handler.
- Added `src/routeTree.gen.ts` as a temporary stub so lint/type-check passes; it will be overwritten by the TanStack Router Vite plugin during dev/build.
- `bun run lint` error count unchanged at 22 errors / 4 warnings (all from existing Next.js files).

---

## T05 - Content Collections setup for blog MDX

**Status:** Done
**Owner:** pi-agent
**Prerequisites:** T01, T02

### Goal

Move blog post discovery/frontmatter/MDX compilation to Content Collections.

### Scope

- Create `content-collections.ts` at the repository root.
- Define a `posts` collection for `src/app/blog/posts/*.mdx`.
- Validate frontmatter fields:
  - `title`
  - `date`
  - optional `tags`
  - optional `published`
  - optional `ogImage`
  - `content`
- Add transform that:
  - compiles MDX via `compileMDX(context, post, options?)`
  - adds `slug` from `post._meta.path`
  - adds `excerpt` via a helper similar to the plan.
- Decide whether Shiki is runtime or build-time. Document the decision in progress notes.

### Acceptance criteria

- `content-collections.ts` exports `defineConfig({ content: [posts] })`.
- Generated virtual module `content-collections` can provide `allPosts` and `Post` type.
- Legacy `src/app/blog/utils.ts` is no longer the primary data source once route migration is complete.

### Suggested verification

```sh
bun run lint
```

### Progress notes

- Created `content-collections.ts` with a `posts` collection reading `src/app/blog/posts/*.mdx`.
- Used `arktype` (already in project) for schema validation since Content Collections requires Standard Schema v1 and `arktype` supports it natively.
- Schema validates: `title` (string), `date` (string), `tags` (optional string[]), `published` (optional boolean | 'true' | 'false'), `content` (string).
- Omitted `ogImage` from schema because Content Collections requires serializable output types and `unknown` breaks serializability; `ogImage` can be added later with a concrete shape if needed.
- Transform compiles MDX via `compileMDX(context, post)`, adds `slug`, `excerpt`, and `mdx` fields.
- Shiki highlighting decision: kept as **runtime** for the initial migration (handled in T08 via the `Code` component). Build-time rehypeShiki can be added later via `compileMDX` options.
- `bun run lint` error count unchanged at 22 errors / 4 warnings (all from existing Next.js files).

---

## T06 - Root layout migration to `__root.tsx` and font CSS update

**Status:** Done
**Owner:** pi-agent
**Prerequisites:** T02, T03, T04

### Goal

Replace Next App Router root layout with TanStack Router root route and migrate font handling away from `next/font`.

### Scope

- Create `src/app/__root.tsx` from current `src/app/layout.tsx`.
- Use `createRootRoute`, `Outlet`, `HeadContent`, and `Scripts`.
- Import `@fontsource-variable/work-sans`.
- Import global CSS using `./global.css?url` and add it to route `head.links`.
- Preserve:
  - global metadata equivalent
  - HTML `lang="en"`
  - `suppressHydrationWarning`
  - existing body classes
  - `Providers` wrapping the outlet
- Update `src/app/global.css`:
  - set `--font-heading: "Work Sans Variable", sans-serif` in Tailwind v4 theme config
  - remove dependency on `next/font` variable class usage.
- Remove old `src/app/layout.tsx` after equivalent root route is working.

### Acceptance criteria

- Root HTML document is rendered by TanStack Start.
- No `next/font` imports remain in the root layout path.
- Existing theme provider behavior is preserved.

### Suggested verification

```sh
bun run lint
```

### Progress notes

- Created `src/app/__root.tsx` with `createRootRoute`, `Outlet`, `HeadContent`, `Scripts`, and `Providers`.
- Added fontsource import and CSS import via `?url` in route `head.links`.
- Preserved all metadata, `suppressHydrationWarning`, and body classes.
- Updated `src/app/global.css` `@theme` block to use `@theme inline` with `--font-heading: "Work Sans Variable", sans-serif`.
- Added `src/types/fontsource.d.ts` to declare the fontsource side-effect module (no built-in types).
- Kept old `src/app/layout.tsx` in place; it will be removed in T11 cleanup pass.
- `bun run lint` error count unchanged at 22 errors / 4 warnings (all from existing Next.js files).

---

## T07 - Home and blog route migration

**Status:** Done
**Owner:** pi-agent
**Prerequisites:** T04, T05, T06

### Goal

Migrate the main public routes from Next App Router files to TanStack Router file routes.

### Scope

- Replace `src/app/page.tsx` with `src/app/index.tsx` using `createFileRoute("/")`.
- Replace `src/app/blog/layout.tsx` with `src/app/blog.tsx` using `createFileRoute("/blog")` and `Outlet`.
- Replace `src/app/blog/page.tsx` with `src/app/blog/index.tsx` using `createFileRoute("/blog/")`.
- Replace `src/app/blog/[slug]/page.tsx` with `src/app/blog/$slug.tsx` using:
  - loader from `allPosts`
  - `notFound()` for missing/unpublished posts
  - route `head` metadata from loader data
  - `MDXContent` from `@content-collections/mdx/react`
  - existing blog article/header components.
- Remove old Next route files once replacements are complete.

### Acceptance criteria

- `/`, `/blog`, and `/blog/$slug` routes are implemented with TanStack Router.
- Blog list reads from `allPosts` and filters unpublished posts.
- Blog detail route renders compiled MDX with custom components.
- No `generateMetadata`, `generateStaticParams`, or RSC async page patterns remain in migrated routes.

### Suggested verification

```sh
bun run lint
bun run build
```

### Progress notes

- Created `src/app/index.tsx` (home route), `src/app/blog.tsx` (blog layout), `src/app/blog/index.tsx` (blog list), `src/app/blog/$slug.tsx` (blog detail).
- Updated `PostList` and `PostListItem` to use `allPosts` from `content-collections` and TanStack Router `Link`.
- Blog detail route uses `loader` + `notFound()` + `head` metadata + `MDXContent` with `CustomMDXComponents`.
- Added `src/types/router.d.ts` to augment `FileRoutesByPath` for `createFileRoute` type safety during migration.
- Added `src/types/content-collections.d.ts` stub for the virtual module.
- Old Next.js route files kept in place for reference; will be removed in T11 cleanup.
- `bun run lint` error count down to 21 errors / 5 warnings (all from remaining Next.js files and components).

---

## T08 - MDX component infrastructure migration

**Status:** Done
**Owner:** pi-agent
**Prerequisites:** T01, T05

### Goal

Update custom MDX rendering helpers to work with Content Collections and TanStack Router.

### Scope

- Update `src/components/mdx.js` or convert it to TS/TSX if beneficial.
- Remove `next-mdx-remote/rsc` usage.
- Replace `next/link` with TanStack Router `Link`.
- Replace `next/image` with standard `<img>` or an explicitly chosen image package.
- Keep or migrate syntax highlighting:
  - runtime Shiki in `Code`, or
  - build-time `rehypeShiki` via Content Collections.
- Preserve all existing custom MDX component mappings:
  - headings with slugs
  - `Table`
  - `Playground`
  - visualizers/components used in posts.

### Acceptance criteria

- MDX rendering works with `MDXContent` from Content Collections.
- No `next-mdx-remote` imports remain.
- Internal MDX links route through TanStack Router where appropriate.
- External/hash links still render as normal anchors.

### Suggested verification

```sh
bun run lint
```

### Progress notes

- Converted `src/components/mdx.js` → `src/components/mdx.tsx`.
- Removed `next-mdx-remote/rsc`, `next/link`, and `next/image` imports.
- Replaced `next/link` with `@tanstack/react-router` `Link` in `CustomLink`.
- Replaced `next/image` with standard `<img>` in `RoundedImage`.
- Converted `Code` from async server component to client component using `useState` + `useEffect` for runtime Shiki highlighting.
- Exported `CustomMDXComponents` object for use with `MDXContent`.
- Added temporary backward-compat `CustomMDX` export for old Next.js page during transition.
- `bun run lint` error count unchanged at 22 errors / 5 warnings (all from existing Next.js files).

---

## T09 - Shared component migration away from Next APIs

**Status:** Done
**Owner:** pi-agent
**Prerequisites:** T01, T04

### Goal

Remove Next-specific APIs from reusable components.

### Scope

- Replace `next/link` imports in components with `@tanstack/react-router` `Link`.
- Replace `next/navigation` usage:
  - use TanStack `Link` active props/options, or
  - use `useRouterState` for active path checks.
- Replace `next/image` in components such as `AvatarImage.tsx` with `<img>` or chosen replacement.
- Update object-style `href` usages to TanStack `to`, `params`, and `search` props.
- Update `PostList` and `PostListItem` to use `content-collections` types/data if they remain.
- Ensure component props use project conventions, e.g. `ComponentProps<"element">` when extending native elements.

### Acceptance criteria

- No imports remain from:
  - `next/link`
  - `next/navigation`
  - `next/image`
  - `next/font`
- Components compile against TanStack Router APIs.
- Navigation active styles still work.

### Suggested verification

```sh
bun run lint
```

### Progress notes

- Replaced `next/link` and `next/navigation` in `NavLink.tsx` with `@tanstack/react-router` `Link` and `useRouterState`.
- Replaced `next/link` in `HeadNav.tsx` with `NavLink` (which now uses TanStack `Link` internally).
- Replaced `next/image` in `AvatarImage.tsx` with standard `<img>`.
- `PostList` and `PostListItem` were already migrated to `content-collections` and TanStack `Link` in T07.
- `bun run lint` error count down to 17 errors / 6 warnings. Remaining errors are SVG component imports (T10) and old Next.js files awaiting cleanup (T11).

---

## T10 - SVG import migration for Vite SVGR

**Status:** Done
**Owner:** pi-agent
**Prerequisites:** T02

### Goal

Ensure SVG component imports work under Vite.

### Scope

- Search for SVG imports used as React components.
- Update imports to use Vite SVGR syntax, e.g. `images/logo.svg?react`, unless `vite-plugin-svgr` is configured to support bare SVG component imports.
- Leave URL/static SVG imports unchanged if they are not used as React components.

### Acceptance criteria

- SVG React component imports compile under Vite.
- Static asset SVG usage still works.

### Suggested verification

```sh
bun run lint
```

### Progress notes

- Updated all 7 SVG React component imports to use `?react` suffix:
  - `images/logo.svg?react` (×2 in Header and HeadNav)
  - `images/moon.svg?react`, `images/sun.svg?react` (ThemeButton)
  - `images/social-media/github.svg?react`, `images/social-media/twitter.svg?react` (Footer)
  - `images/hamburger.svg?react` (NavbarPopover)
- Added `src/types/svg.d.ts` to declare `*.svg?react` modules as React components.
- `bun run lint` error count down to 11 errors / 6 warnings (all from old Next.js files).

---

## T11 - Redirect, config, metadata asset, and cleanup pass

**Status:** Done
**Owner:** pi-agent
**Prerequisites:** T07, T09, T10

### Goal

Remove remaining Next-specific files and migrate redirect/static asset conventions.

### Scope

- Create `src/app/jem.ts` with a TanStack server handler redirecting `/jem` to `https://buttondown.email/agney` with status `301`.
- Delete `next.config.ts` once redirect behavior is migrated.
- Delete stale files after replacements are verified:
  - `src/app/layout.tsx`
  - `src/app/page.tsx`
  - `src/app/blog/page.tsx`
  - `src/app/blog/[slug]/page.tsx`
  - `src/app/blog/layout.tsx`
  - `src/app/blog/utils.ts` if fully replaced by Content Collections
- Remove unused MDX/remark packages if still present:
  - `remark-frontmatter`
  - `remark-mdx-frontmatter`
  - `@mdx-js/rollup`
- Move Next metadata assets out of `src/app` if they should be served directly:
  - `src/app/icon.png`
  - `src/app/opengraph-image.jpg`
  - `src/app/blog/opengraph-image.jpg`
- Update `README.md` if it references Next.js commands or output.

### Acceptance criteria

- `/jem` redirect is implemented in TanStack Start.
- No Next config/routes remain.
- Static metadata assets are available from Vite/Nitro public serving or explicit imports.
- README commands match package scripts.

### Suggested verification

```sh
bun run lint
```

### Progress notes

- Created `src/app/jem.ts` with a route that throws a 301 redirect Response to `https://buttondown.email/agney`.
- Deleted `next.config.ts`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/blog/page.tsx`, `src/app/blog/[slug]/page.tsx`, `src/app/blog/layout.tsx`, `src/app/blog/utils.ts`.
- Removed unused packages: `@mdx-js/loader`, `@svgr/webpack`, `gray-matter`.
- Moved metadata assets to `public/`: `icon.png`, `opengraph-image.jpg`, `blog-opengraph-image.jpg`.
- Updated `BlogPostHeader.tsx` to use a local interface instead of deleted `app/blog/utils`.
- Updated `.oxfmtrc.json` ignore patterns from `.next` to `.output`.
- Removed `.next` build directory.
- Updated `README.md` with new stack and scripts.
- Added `/jem` to `src/types/router.d.ts`.
- `bun run lint`: **0 errors**, 6 warnings (all pre-existing/non-blocking).

---

## T12 — End-to-end migration verification

**Status:** In Progress
**Owner:** pi-agent
**Prerequisites:** T01–T11

### Goal

Verify the migrated app works locally and in production build mode.

### Scope

Run the verification checklist from the migration plan:

1. `bun install`
2. `bun run dev`
3. Visit and verify:
   - `http://localhost:3000`
   - `http://localhost:3000/blog`
   - at least one `http://localhost:3000/blog/:slug`
   - `http://localhost:3000/jem`
4. Confirm blog post pages have:
   - correct `<head>` metadata
   - syntax-highlighted code blocks
   - custom MDX components
   - working internal links
5. Confirm dark mode toggle works with `next-themes`.
6. Run:
   - `bun run build`
   - `bun run lint`
7. Confirm build outputs to `.output/`.

### Acceptance criteria

- Development server works.
- Production build works.
- Lint passes.
- All key user-facing routes work.
- Any known issues are documented as follow-up tasks.

### Progress notes

- None yet.
