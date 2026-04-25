# Migrate Portfolio to TanStack Start

This plan migrates the Next.js 16 App Router portfolio to **TanStack Start** with file-based routing, Vite, and Nitro. It is based on the official [TanStack Start migration guide](https://tanstack.com/start/latest/docs/framework/react/migrate-from-next-js) and Context7 documentation (`/websites/tanstack_start_framework_react`).

---

## Current State Summary

- **Framework**: Next.js 16 (App Router) → TanStack Start
- **Router**: `src/app` file-system routes → TanStack Router file-based routes (`src/app` preserved)
- **Build tool**: Webpack/Turbopack → Vite + Nitro
- **Styling**: Tailwind CSS v4 via `@tailwindcss/postcss` → `@tailwindcss/vite`
- **MDX**: `next-mdx-remote/rsc` → `@content-collections/core` + `@content-collections/vite` + `@content-collections/mdx`
- **Fonts**: `next/font/google` → `@fontsource-variable/work-sans`
- **Images**: `next/image` → standard `<img>` or `@unpic/react`
- **Links**: `next/link` → `@tanstack/react-router` `Link`
- **Metadata**: `Metadata` API / `generateMetadata` → route `head` property
- **Data fetching**: RSC async components / `generateStaticParams` → `loader` + `createServerFn` + static prerendering
- **Path alias**: `* → ./src/*` (kept, resolved via `tsconfigPaths: true` in Vite)

---

## Step 1: Dependency Swap

### Remove Next.js packages

```sh
bun remove next @next/mdx @tailwindcss/postcss next-mdx-remote next-plugin-svgr @vercel/speed-insights
```

Keep `next-themes` for the initial migration because the current app uses it in `src/app/providers.tsx`, `ThemeButton`, `PlaygroundWrapper`, and MDX visualizers. Replace it later only if you also migrate all theme consumers.

Also remove `postcss.config.mjs` (Tailwind v4 Vite plugin replaces it).

### Install TanStack Start & Vite toolchain

```sh
bun add @tanstack/react-router @tanstack/react-start nitro vite @vitejs/plugin-react
```

### Install Tailwind v4 Vite plugin

```sh
bun add -D @tailwindcss/vite
```

### Install Content Collections

```sh
bun add @content-collections/core
bun add -D @content-collections/vite
```

> Content Collections is the recommended way to manage static markdown/MDX content in TanStack Start. It processes files at build time, provides type-safe access, and generates a virtual module (`content-collections`).

### Install MDX runtime

```sh
bun add @mdx-js/react @content-collections/mdx
```

`@content-collections/mdx` provides `compileMDX` and `MDXContent` for rendering compiled MDX from Content Collections.

### Install Shiki rehype plugin (build-time highlighting)

```sh
bun add -D @shikijs/rehype
```

### Install font replacement

```sh
bun add @fontsource-variable/work-sans
```

### Install Vite SVGR plugin

```sh
bun add -D vite-plugin-svgr
```

Existing SVG component imports such as `import LogoSvg from "images/logo.svg"` must be updated for Vite SVGR, typically to `import LogoSvg from "images/logo.svg?react"`, unless the SVGR plugin is configured to transform bare `.svg` imports.

### Update `package.json` scripts

```json
{
  "type": "module",
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "start": "node .output/server/index.mjs",
    "lint": "oxlint",
    "format": "oxfmt",
    "format:check": "oxfmt --check"
  }
}
```

> `next` plugin references in `tsconfig.json` `plugins` array and `next-env.d.ts` / `.next/types` includes should also be removed in Step 3.

---

## Step 2: Vite Configuration

Create `vite.config.ts` at the repository root.

```ts
import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";
import contentCollections from "@content-collections/vite";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  server: {
    port: 3000,
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    tailwindcss(),
    contentCollections(),
    tanstackStart({
      srcDirectory: "src",
      router: {
        routesDirectory: "app",
      },
      prerender: {
        enabled: true,
        crawlLinks: true,
        autoStaticPathsDiscovery: true,
        failOnError: true,
      },
      sitemap: {
        enabled: true,
        host: "https://agney.dev",
      },
    }),
    viteReact(),
    nitro(),
    svgr(),
  ],
});
```

> `@content-collections/vite` should appear before `tanstackStart()` so collections are generated before the router plugin resolves imports.

---

## Step 3: TypeScript Configuration

Update `tsconfig.json`:

1. Remove the `next` plugin:
   ```json
   "plugins": []
   ```
2. Remove Next.js type includes and replace with TanStack Start types:
   ```json
   "include": [
     "src/**/*.ts",
     "src/**/*.tsx",
     "src/**/*.mts",
     "**/*.ts",
     "**/*.tsx",
     "**/*.mts"
   ]
   ```
3. Keep `"jsx": "react-jsx"` and `"moduleResolution": "bundler"`.
4. Keep path alias `"*": ["./src/*"]`.

Delete `next-env.d.ts` and `.next/` from `.gitignore` (keep `dist` / `.output` instead).

---

## Step 4: Router & Entry Points

TanStack Start requires a router definition, a client entry point, and a server entry point.

### `src/router.tsx`

```tsx
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
  });

  return router;
}
```

### `src/app/client.tsx`

```tsx
import { StartClient } from "@tanstack/react-start/client";
import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";

hydrateRoot(
  document,
  <StrictMode>
    <StartClient />
  </StrictMode>,
);
```

### `src/app/server.ts`

```tsx
import handler, { createServerEntry } from "@tanstack/react-start/server-entry";

export default createServerEntry({
  fetch(request) {
    return handler.fetch(request);
  },
});
```

> `client.tsx` and `server.ts` are conventional entry files. `tanstackStart()` plugin auto-discovers them when placed inside `src/app`.

---

## Step 4.5: Content Collections Configuration

Create `content-collections.ts` at the repository root.

````ts
import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";

function createExcerpt(content: string) {
  return (
    content
      .replace(/^import\s.+$/gm, "")
      .replace(/```[\s\S]*?```/g, "")
      .replace(/<[^>]+>/g, "")
      .split(/\n{2,}/)
      .map((paragraph) => paragraph.replace(/^#+\s*/, "").trim())
      .find(Boolean) ?? ""
  );
}

const posts = defineCollection({
  name: "posts",
  directory: "src/app/blog/posts",
  include: "*.mdx",
  schema: (z) => ({
    title: z.string(),
    date: z.string(),
    tags: z.array(z.string()).optional(),
    published: z
      .union([z.boolean(), z.literal("true"), z.literal("false")])
      .optional(),
    ogImage: z.unknown().optional(),
    content: z.string(),
  }),
  transform: async (post, context) => {
    const mdx = await compileMDX(context, post, {
      // Add rehypePlugins: [[rehypeShiki, { themes: { light: "github-light", dark: "tokyo-night" } }]]
      // if switching from runtime Shiki to build-time highlighting.
    });

    return {
      ...post,
      slug: post._meta.path,
      excerpt: createExcerpt(post.content),
      mdx,
    };
  },
});

export default defineConfig({
  content: [posts],
});
````

> Content Collections generates a virtual `content-collections` module at build time. It reads `.mdx` files, validates frontmatter against the schema, and transforms content. Do not re-run `gray-matter` inside `transform`; the frontmatter parser already exposes frontmatter fields and `content` as the MDX body. Install `@types/mdast` or `@types/mdx` if TypeScript complains about MDX imports.

---

## Step 5: Root Layout (`src/app/__root.tsx`)

Migrate `src/app/layout.tsx` → `src/app/__root.tsx`.

```tsx
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import "@fontsource-variable/work-sans";
import appCss from "./global.css?url";
import { Providers } from "./providers";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      { title: "Portfolio | Agney" },
      {
        name: "description",
        content: "A portfolio for Web Developer - Agney Menon",
      },
      {
        name: "keywords",
        content: "Frontend Developer, Developer, Engineer, Portfolio",
      },
      { name: "creator", content: "Agney" },
      { name: "robots", content: "index, follow" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: "/icon.png" },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="h-full bg-slate-50 selection:bg-indigo-100 dark:bg-slate-800 dark:selection:bg-indigo-600">
        <Providers>
          <Outlet />
        </Providers>
        <Scripts />
      </body>
    </html>
  );
}
```

### Font CSS update (`src/app/global.css`)

Add font-family mapping inside the CSS file (Tailwind v4 `@theme inline`):

```css
@import "tailwindcss";

@theme inline {
  --font-heading: "Work Sans Variable", sans-serif;
  /* ...existing tokens... */
}
```

Remove the `next/font/google` import and `workSansFont.variable` class usage. Import `Providers` from `./providers` in `__root.tsx` and preserve `suppressHydrationWarning` on `<html>` because `next-themes` mutates the root element during hydration.

> `next-themes` (`ThemeProvider`) is kept for the first migration pass. Wrap `<Outlet />` with `<Providers>` inside `RootComponent` just as before. `next-themes` works with any React app; replace it later with a lightweight custom theme hook only if desired.

---

## Step 6: Route File Migration

### Route mapping

| Next.js file                   | TanStack Start file                                                               |
| ------------------------------ | --------------------------------------------------------------------------------- |
| `src/app/page.tsx`             | `src/app/index.tsx`                                                               |
| `src/app/blog/layout.tsx`      | `src/app/blog.tsx` _(normal `/blog` parent layout route)_ or inline in each child |
| `src/app/blog/page.tsx`        | `src/app/blog/index.tsx`                                                          |
| `src/app/blog/[slug]/page.tsx` | `src/app/blog/$slug.tsx`                                                          |
| `src/app/api/.../route.ts`     | `src/app/api/....ts` _(server handlers)_                                          |

### 6.1 Home page (`src/app/index.tsx`)

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { HeadNav, Intro, Footer } from "components/HomePage";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="grid h-full grid-rows-[3rem_1fr_6rem]">
      <HeadNav />
      <Intro />
      <Footer />
    </div>
  );
}
```

### 6.2 Blog layout (`src/app/blog.tsx`)

```tsx
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { HeadNav } from "components/HomePage";

export const Route = createFileRoute("/blog")({
  component: BlogLayout,
});

function BlogLayout() {
  return (
    <div className="grid h-full grid-rows-[3rem_1fr] overflow-y-auto">
      <HeadNav />
      <main className="min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
```

### 6.3 Blog list (`src/app/blog/index.tsx`)

```tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { SkipNavContent } from "components/uikit/SkipNav";
import { Header } from "components/BlogHome/Header";
import { SubscribeNewsletter } from "components/BlogHome/SubscribeNewsletter";
import { allPosts } from "content-collections";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [{ title: "Blog | Agney" }],
  }),
  component: BlogHome,
});

function BlogHome() {
  const posts = allPosts
    .filter((post) => post.published !== false && post.published !== "false")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="min-h-full">
      <SkipNavContent />
      <header className="py-24">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-y-16 px-4 sm:px-6 lg:px-8">
          <Header />
          <SubscribeNewsletter />
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-8 pb-20">
        <ul>
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                to="/blog/$slug"
                params={{ slug: post.slug }}
                search={{ title: post.title }}
              >
                <article className="flex flex-col gap-y-4 py-2">
                  <header className="flex flex-col gap-y-1">
                    <h3 className="text-xl text-balance">{post.title}</h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {post.date}
                    </span>
                  </header>
                  {post.excerpt && (
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {post.excerpt}
                    </p>
                  )}
                </article>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
```

### 6.4 Blog post detail (`src/app/blog/$slug.tsx`)

This replaces `generateStaticParams`, `generateMetadata`, and the async RSC page.

```tsx
import { createFileRoute, notFound } from "@tanstack/react-router";
import { BlogArticleContainer } from "components/BlogHome/BlogArticleContainer";
import { BlogPostHeader } from "components/BlogHome/BlogPostHeader";
import { MDXContent } from "@content-collections/mdx/react";
import { allPosts } from "content-collections";
import { CustomMDXComponents } from "components/mdx";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = allPosts.find((p) => p.slug === params.slug);
    if (!post) throw notFound();
    if (post.published === false || post.published === "false")
      throw notFound();
    return { post };
  },
  head: ({ loaderData }) => {
    const post = loaderData?.post;
    return {
      meta: [
        { title: post?.title ? `${post.title} | Agney` : "Blog" },
        { name: "description", content: post?.title ?? "" },
        { name: "keywords", content: post?.tags?.join(", ") ?? "" },
        { property: "og:title", content: post?.title ?? "" },
        { property: "og:type", content: "article" },
        { property: "og:publishedTime", content: post?.date ?? "" },
      ],
    };
  },
  component: BlogPostPage,
});

function BlogPostPage() {
  const { post } = Route.useLoaderData();

  return (
    <BlogArticleContainer>
      <BlogPostHeader
        frontmatter={{
          title: post.title,
          date: post.date,
        }}
      />
      <MDXContent code={post.mdx} components={CustomMDXComponents} />
    </BlogArticleContainer>
  );
}
```

> `notFound()` imported from `@tanstack/react-router` triggers the 404 UI. `MDXContent` from `@content-collections/mdx/react` renders the compiled MDX string from `post.mdx` with your custom components. Ensure `@content-collections/mdx` is installed.

---

## Step 7: MDX Infrastructure Overhaul

### 7.1 Remove `next-mdx-remote`

The `next-mdx-remote/rsc` pattern is replaced by Content Collections plus `@content-collections/mdx`. `content-collections.ts` must call `compileMDX(context, post)` and expose a compiled `mdx` field via the virtual `content-collections` module.

### 7.2 Update `src/components/mdx.js`

- Remove `MDXRemote` import.
- Remove `next/link` → use `@tanstack/react-router` `Link`.
- Remove `next/image` → use standard `<img>` (or `@unpic/react` if image optimization is desired).
- Keep `Code` component but update it: Content Collections does **not** run `@shikijs/rehype` automatically. Either:
  - Run Shiki at runtime inside `Code`, or
  - Pass `rehypeShiki` through `compileMDX(context, post, { rehypePlugins: [...] })` in `content-collections.ts`.

The simplest path for a migration is to keep runtime Shiki highlighting:

```tsx
import { Link } from "@tanstack/react-router";
import { codeToHtml } from "shiki";
import { useState, useEffect } from "react";
import { PlaygroundWrapper } from "components/uikit/PlaygroundWrapper";
import { BubblingVisualizer } from "components/BlogHome/PostComponents/BubblingVisualizer";
import { SynEventViewer } from "components/BlogHome/PostComponents/SynEventViewer";
import { EventDelegationCode } from "components/BlogHome/PostComponents/EventDelegationCode";
import { PropagationVisualizer } from "components/BlogHome/PostComponents/PropagationVisualizer";

function Table({ data }) {
  /* unchanged */
}

function CustomLink({ href = "", children, ...props }) {
  if (href.startsWith("/")) {
    return (
      <Link to={href} {...props}>
        {children}
      </Link>
    );
  }
  if (href.startsWith("#")) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  );
}

function RoundedImage(props) {
  return <img alt={props.alt} className="rounded-lg" {...props} />;
}

function Code({ children, ...props }) {
  const lang = props.className?.replace("language-", "");
  if (lang) {
    const [html, setHtml] = useState("");
    useEffect(() => {
      codeToHtml(children, {
        themes: { light: "github-light", dark: "tokyo-night" },
        lang,
      }).then(setHtml);
    }, [children, lang]);
    return (
      <div
        className="overflow-x-auto"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }
  return <code {...props}>{children}</code>;
}

/* heading / slugify helpers unchanged */

export const CustomMDXComponents = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  img: RoundedImage,
  a: CustomLink,
  code: Code,
  Table,
  Playground: PlaygroundWrapper,
  BubblingVisualizer,
  SynEventViewer,
  EventDelegationCode,
  PropagationVisualizer,
};
```

### 7.3 Deprecate `src/app/blog/utils.ts`

With Content Collections, frontmatter parsing and validation happen in `content-collections.ts`. You can keep `utils.ts` as a fallback during the transition, but `allPosts` from `content-collections` becomes the primary data source. Delete `utils.ts` once the migration is verified.

If you still need `fs`-based helpers for non-build-time operations, wrap them in `createServerFn`:

```ts
import { createServerFn } from "@tanstack/react-start";

export const fetchBlogPosts = createServerFn().handler(async () => {
  /* legacy fs logic */
});
```

---

## Step 8: Component Updates

### `src/components/BlogHome/PostList.tsx` and `PostListItem.tsx`

Prefer keeping the existing `PostList` component and migrating it to use `allPosts` from `content-collections`; otherwise delete `PostList` after inlining its logic in `src/app/blog/index.tsx`.

Replace `next/link` with TanStack `Link`. Object-based `href` becomes `to` + `params` + `search`. Import the `Post` type from `content-collections` instead of the old `Frontmatter` utility.

```tsx
import { Link } from "@tanstack/react-router";
import type { Post } from "content-collections";
import { DateString } from "./DateString";

interface PostListItemProps {
  meta: Post;
  slug: string;
}

export function PostListItem({ meta, slug }: PostListItemProps) {
  return (
    <Link to="/blog/$slug" params={{ slug }} search={{ title: meta.title }}>
      <article className="flex flex-col gap-y-4 py-2">
        <header className="flex flex-col gap-y-1">
          <h3 className="text-xl text-balance">{meta.title}</h3>
          <DateString className="text-xs text-gray-500 dark:text-gray-400">
            {meta.date}
          </DateString>
        </header>
      </article>
    </Link>
  );
}
```

### Navigation components

Migrate all remaining Next navigation imports:

- `src/components/HomePage/HeadNav.tsx`: replace `next/link` with TanStack `Link`.
- `src/components/uikit/NavLink.tsx`: replace `next/link` and `usePathname` from `next/navigation`. Either use TanStack `Link` with `activeProps` / `activeOptions`, or use `useRouterState` to compute active state.

### SVG components

Update SVG component imports for Vite SVGR. For example:

```tsx
import LogoSvg from "images/logo.svg?react";
```

### `AvatarImage.tsx` and other image components

Replace `next/image` with `<img>` or `@unpic/react`. Remove `width`/`height` string props if present; use numbers or Tailwind sizing classes.

---

## Step 9: Redirects

The current `next.config.ts` redirect for `/jem` → `https://buttondown.email/agney` is moved to a server route file.

Create `src/app/jem.ts`:

```ts
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/jem")({
  server: {
    handlers: {
      GET: () => Response.redirect("https://buttondown.email/agney", 301),
    },
  },
});
```

Delete `next.config.ts`.

---

## Step 10: Static Prerendering & Sitemap

Already configured in `vite.config.ts` (Step 2) with:

```ts
prerender: {
  enabled: true,
  crawlLinks: true,
  autoStaticPathsDiscovery: true,
  failOnError: true,
},
sitemap: {
  enabled: true,
  host: "https://agney.dev",
},
```

`crawlLinks: true` ensures the crawler discovers every blog post linked from `/blog`. If any post is unreachable via links, add explicit `pages` entries in the TanStack Start plugin config.

---

## Step 11: Cleanup Checklist

- [ ] Delete `next.config.ts`
- [ ] Delete `postcss.config.mjs`
- [ ] Delete `next-env.d.ts`
- [ ] Delete `.next/` directory
- [ ] Delete `src/app/layout.tsx` (replaced by `__root.tsx`)
- [ ] Delete `src/app/page.tsx` (replaced by `index.tsx`)
- [ ] Delete `src/app/blog/page.tsx` (replaced by `blog/index.tsx`)
- [ ] Delete `src/app/blog/[slug]/page.tsx` (replaced by `blog/$slug.tsx`)
- [ ] Delete `src/app/blog/layout.tsx` (replaced by `blog.tsx`)
- [ ] Delete `src/app/blog/utils.ts` once Content Collections is fully wired
- [ ] Delete `remark-frontmatter`, `remark-mdx-frontmatter`, `@mdx-js/rollup` if still in `package.json`
- [ ] Remove `.next/types/**/*.ts` and `.next/dev/types/**/*.ts` from `tsconfig.json` includes
- [ ] Move Next file-based metadata assets out of `src/app` if they need to be served directly: `src/app/icon.png`, `src/app/opengraph-image.jpg`, and `src/app/blog/opengraph-image.jpg` should become `public/` assets or be explicitly imported/linked.
- [ ] Ensure `public/` assets are still served by Vite / Nitro (they are automatically)
- [ ] Replace all remaining `next/link`, `next/image`, `next/navigation`, and `next/font` imports
- [ ] Update SVG imports to use Vite SVGR (`?react`) or configure SVGR for bare imports
- [ ] Update `README.md` if it references Next.js commands

---

## Step 12: Verification

```sh
bun install
bun run dev
```

Verify:

1. `http://localhost:3000` renders the portfolio home page.
2. `http://localhost:3000/blog` lists all posts.
3. `http://localhost:3000/blog/:slug` renders an individual MDX post with:
   - Correct metadata in `<head>`
   - Syntax-highlighted code blocks
   - Custom MDX components (Playground, visualizers, etc.)
   - Working internal links (`CustomLink`)
4. Dark mode toggle works (`next-themes`).
5. `http://localhost:3000/jem` redirects to Buttondown.
6. `bun run build` completes without errors and outputs to `.output/`.
7. `bun run lint` passes.

---

## Key Conceptual Shifts

| Concept            | Next.js                                      | TanStack Start                                                                         |
| ------------------ | -------------------------------------------- | -------------------------------------------------------------------------------------- |
| Root layout        | `layout.tsx`                                 | `__root.tsx` + `createRootRoute`                                                       |
| Metadata           | `export const metadata` / `generateMetadata` | Route `head` property (static or from `loaderData`)                                    |
| Data fetching      | Async RSC + `fetch`                          | `loader` (runs on server by default) + `createServerFn`                                |
| Static generation  | `generateStaticParams`                       | Static `prerender` + `crawlLinks` in Vite plugin                                       |
| Server logic       | `'use server'` functions                     | `createServerFn`                                                                       |
| API routes         | `route.ts` with `GET`/`POST` exports         | `createFileRoute` with `server.handlers`                                               |
| Image optimization | `next/image`                                 | `<img>` or `@unpic/react`                                                              |
| Fonts              | `next/font/google`                           | Fontsource + Tailwind `@theme`                                                         |
| MDX                | `next-mdx-remote/rsc`                        | `@content-collections/core` + `@content-collections/vite` + `@content-collections/mdx` |
| Build output       | `.next/`                                     | `.output/` (Nitro)                                                                     |

---

_Plan generated using TanStack Start documentation via `bunx ctx7 docs /websites/tanstack_start_framework_react`._
