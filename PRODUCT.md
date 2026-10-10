# Product

<!-- impeccable:product-schema 1 -->

> Written during an unattended redesign run. The init interview could not be
> held live, so facts below come from the repository and Agney's brief ("This
> is a developer portfolio. Let's have some fun."). Lines marked _(inferred)_
> are hypotheses for Agney to confirm or correct.

## Platform

web

## Users

- Fellow frontend and web developers arriving from a search result, a social
  post, or the JEM newsletter, usually to read one specific blog post about
  React, CSS, JavaScript, or agent-assisted development. _(inferred from post
  topics and the newsletter)_
- People sizing up Agney as an engineer (collaborators, recruiters, peers),
  who land on the home page and want to know who he is and where his work
  lives in a few seconds. _(inferred)_
- Agney himself, who uses Webmarks as a public bookmark shelf he searches and
  filters. _(inferred from the webmarks feature)_

## Product Purpose

agney.dev is Agney Menon's personal site: an introduction ("Web Developer.
Storyteller."), a long-running blog with interactive explainers, a public
bookmark collection (Webmarks), a link to the monthly "JavaScript Every Month"
(JEM) newsletter on Buttondown, and a living design-system page at /design that
renders DESIGN.md. Success means readers finish posts, play with the demos, and
come back or subscribe.

## Positioning

The blog teaches by letting readers poke at the thing: event bubbling
visualizers, cascade-origin quizzes, a notifyOnChangeProps playground, P3 gamut
demos, rough-sketch charts. A neighbouring developer blog cannot claim that
archive of hand-built interactive explainers.

## Operating Context

- Readers mostly on desktop browsers while working, plus phones from social
  links. _(inferred)_
- Both light and dark mode are used; the theme toggle is a first-class control.
- Posts are MDX with Shiki-highlighted code (dual light/dark themes), embedded
  `@agney/playground` sandboxes, and lazy-loaded demo components.

## Capabilities and Constraints

- Routes: `/` (home), `/blog`, `/blog/$slug`, `/blog/tag/$tag`, `/webmarks`
  (search, tag filter, sort, cursor-based Load more), `/design`, `/og`
  (generated Open Graph image).
- TanStack Start + React 19, Tailwind CSS v4, Content Collections MDX,
  prose-ui for article typography. Deployed on Vercel; every push to master
  deploys to production.
- Fonts must be self-hosted via @fontsource packages; no font CDNs.
- No tests; quality gates are oxlint (type-aware), oxfmt, and the build.

## Brand Commitments

- Name and voice: "Agney Menon", "Hey, I'm", "Web Developer. Storyteller.",
  the newsletter's "I want in!" button. Plain, friendly, a little cheeky.
- The hand-drawn logo mark (`src/images/logo.svg`) and the avatar photo.
- Brief for the 2026 redesign: "This is a developer portfolio. Let's have some
  fun." Bold and playful is the pinned energy.

## Evidence on Hand

- 60+ blog posts in `src/app/blog/posts/` with real dates and tags.
- Interactive post components in `src/components/BlogHome/PostComponents/`.
- Avatar `src/images/avatar-400x400.jpg`, logo SVG, social icons (GitHub,
  Twitter).
- No testimonials, client logos, job history, or project case studies exist
  in the repo; do not invent them. "Projects" links out to GitHub.

## Product Principles

1. Writing is the product; every page should make the next read easy to find.
2. Show, don't tell: interactive demos and real artifacts over claims.
3. Personality is welcome everywhere, but it never blocks reading or the task.
4. Fast and accessible by default: works without motion, in both themes, on a
   phone.

## Accessibility & Inclusion

- WCAG AA contrast in light and dark themes.
- Respect `prefers-reduced-motion`; nothing essential depends on animation.
- Keyboard reachable everything, visible focus, skip link preserved.
