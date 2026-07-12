---
version: alpha
name: Slate & Indigo
description: A clean, content-first personal portfolio with slate neutrals, indigo accents, and typography-driven hierarchy. Dark mode native.
colors:
  primary: "#0f172a"
  secondary: "#475569"
  secondary-strong: "#334155"
  secondary-muted: "#64748b"
  tertiary: "#94a3b8"
  accent: "#4f46e5"
  accent-hover: "#6366f1"
  accent-muted: "#a5b4fc"
  accent-light: "#e0e7ff"
  surface: "#f8fafc"
  muted: "#e2e8f0"
  text-on-accent: "#ffffff"
  quote-accent: "#f59e0b"
typography:
  display:
    fontFamily: Work Sans
    fontSize: 3.75rem
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  h1:
    fontFamily: Work Sans
    fontSize: 2.25rem
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  h2:
    fontFamily: Work Sans
    fontSize: 1.875rem
    fontWeight: 700
    lineHeight: 1.3
  h3:
    fontFamily: Work Sans
    fontSize: 1.25rem
    fontWeight: 700
    lineHeight: 1.4
  body-lg:
    fontFamily: Work Sans
    fontSize: 1.25rem
    fontWeight: 500
    lineHeight: 1.6
  body:
    fontFamily: Work Sans
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.75
  label-sm:
    fontFamily: Work Sans
    fontSize: 0.75rem
    fontWeight: 500
    lineHeight: 1
  caption:
    fontFamily: Work Sans
    fontSize: 0.75rem
    fontWeight: 400
    lineHeight: 1.4
rounded:
  sm: 4px
  md: 6px
  lg: 8px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
  content-max: 65ch
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.text-on-accent}"
    rounded: "{rounded.md}"
    padding: 8px 12px
    typography: "{typography.label-sm}"
  button-primary-hover:
    backgroundColor: "{colors.accent-hover}"
  tag-badge:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.secondary}"
    rounded: "{rounded.full}"
    padding: 2px 12px
  tag-badge-hover:
    textColor: "{colors.primary}"
  input-field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    rounded: "{rounded.md}"
    padding: 8px 12px
  input-field-focus:
    textColor: "{colors.accent}"
  nav-link:
    textColor: "{colors.secondary}"
    typography: "{typography.body}"
  nav-link-active:
    textColor: "{colors.primary}"
  nav-link-hover:
    textColor: "{colors.primary}"
  prose-quote:
    textColor: "{colors.secondary}"
    rounded: "{rounded.lg}"
    padding: 16px 24px
---

## Overview

Slate & Indigo is a clean, content-first design system for a personal portfolio
and blog. It prioritises readability and calm navigation, using a restricted
slate-neutral palette with a single indigo accent for all interactive cues.
Dark mode is a first-class citizen — every color token flips via CSS custom\nproperty overrides in a `.dark` selector. Components use the same token name\nin both themes; the variable value changes, not the class.

The personality is **restrained but warm**: generous whitespace, a single
variable font family (Work Sans) spanning every weight, and subtle motion
(animated underlines, scale transforms on hover). The feel should be
"engineer's notebook" — precise, uncluttered, trustworthy.

## Colors

The palette is built on Tailwind's slate scale for neutrals and indigo for
accent. Only indigo drives interaction — there is no secondary accent color.
Dark mode is handled by CSS variable overrides (`.dark { ... }`), not
`dark:` utility prefixes — every token has a single canonical name that
resolves to the correct value per theme.

- **Primary (#0f172a / dark: #f1f5f9):** Near-black slate for headlines and
  body text in light mode, flipping to a near-white slate in dark mode.
  Provides maximum readability without harsh black/white extremes.
- **Secondary (#475569 / dark: #94a3b8):** Muted slate for supporting text,
  captions, metadata, and inactive navigation.
- **Secondary Strong (#334155 / dark: #cbd5e1):** A bolder secondary for
  emphasized supporting text.
- **Secondary Muted (#64748b / dark: #94a3b8):** A lighter secondary for
  dates, tag text, and subtle metadata.
- **Tertiary (#94a3b8 / dark: #64748b):** The most muted text tier — figure
  captions, placeholder text. Flips to a darker shade in dark mode to
  maintain contrast against the dark surface.
- **Accent (#4f46e5 / dark: #6366f1):** Indigo — the sole driver for
  interactive elements. Used for primary buttons, focus rings, active nav
  states, and decorative underlines. Hover state is `accent-hover` (#6366f1
  in light, #818cf8 in dark).
- **Accent Light (#e0e7ff / dark: #4f46e5):** Used for text selection
  highlights. Flips from a light indigo wash to a saturated indigo in dark
  mode.
- **Accent Muted (#a5b4fc / dark: #6366f1):** Decorative accents like dashed
  underlines.
- **Surface (#f8fafc / dark: #1e293b):** Page background — a warm off-white
  slate in light mode, dark slate in dark mode.
- **Muted (#e2e8f0 / dark: #334155):** Borders, dividers, input rings, and
  tag outlines.
- **Quote Accent (#f59e0b):** A restrained amber used only for blockquote
  left-border accents — the single warm note in an otherwise cool palette.
  Does not flip in dark mode (amber reads well on dark backgrounds).
- **Text on Accent (#ffffff):** White text on indigo buttons and elements to
  guarantee WCAG AA contrast. Does not flip.

## Typography

**Work Sans Variable** is the sole type family, used at every level from
72px display to 12px captions. The variable axis (weight 100–900) eliminates
the need for multiple font files while providing precise control.

- **Display:** 60px (3.75rem) Extrabold at -0.025em tracking. Reserved for the
  hero name on the homepage. Intentionally oversized to establish presence.
- **Headings:** Work Sans Extrabold (h1: 36px, h2: 30px, h3: 20px) with
  progressively tighter tracking at larger sizes. All headings use the
  `--font-heading` CSS variable.
- **Body:** 16px Regular at 1.75 line-height for long-form reading. The
  generous leading and 65ch max-width column create a comfortable measure.
- **Body Large:** 20px Medium. Used for the homepage tagline — larger but
  lighter-weight to feel approachable.
- **Labels & Captions:** 12px at tighter leading (1.0–1.4). Used for dates,
  tag badges, and figure captions.

## Layout

The layout follows a **content-column grid** model. Pages use CSS Grid with
named rows: a 3rem sticky navbar row, a flexible content row, and (on the
homepage) a 6rem footer row.

Blog articles use a three-column grid with a 65ch content column flanked by
flexible margins:

```
grid-cols-[minmax(1.5rem,1fr)_minmax(0,65ch)_minmax(1.5rem,1fr)]
```

Full-bleed elements (wide charts, code blocks) span all three columns via
`.article-full-bleed`.

Spacing follows an 8px base unit with half-steps (4px) for micro-adjustments.
The scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64px. Vertical rhythm is
generous — 16px between sections, 64px for major content breaks.

The navbar is sticky with `backdrop-blur` for a frosted-glass effect over
scrolling content. Navigation links sit on the right on desktop, collapsing
into a popover on mobile.

## Elevation & Depth

Depth is achieved through **subtle tonal separation**, not heavy shadows. The
approach is largely flat with strategic depth cues:

- Background surfaces use distinct slate tones: surface (#f8fafc) for the page,
  pure white cards for OG images and elevated content.
- `shadow-xs` (1px blur) on inputs for subtle inset feel. `shadow-lg` (24px
  blur) reserved for cover images to lift them off the page.
- The navbar uses `backdrop-blur-xs` with `opacity-90` over the scrollable
  content — a lightweight frosted-glass effect that indicates elevation without
  a drop shadow.
- Dividers (`<hr>`) separate article footer from content with a faint
  `border-muted`.

## Shapes

The shape language is **soft rectangles** — corners are rounded but never
fully circular except for tag badges.

- **4px (sm):** Minimum radius for cards and subtle rounding.
- **6px (md):** Default for buttons and input fields. Enough to feel modern
  without sacrificing the "engineered" aesthetic.
- **8px (lg):** Cover images and blockquote right edges.
- **9999px (full):** Tag badges — the only fully rounded elements, creating a
  pill shape that visually distinguishes them from interactive controls.
- **Sharp:** Blockquote left edge is a straight 4px border with no radius on
  that side, creating an intentional sharp/soft contrast (sharp left, rounded
  right).

## Components

- **Buttons:** The primary button is indigo-600 with white text, 6px radius,
  8px×12px padding, and a `font-semibold` label. Hover lightens to indigo-500.
  Focus ring uses `outline-2 outline-offset-2 outline-indigo-600`. There are
  no secondary or tertiary button variants — the primary button is the only
  high-emphasis action on a page.

- **Tag Badges:** Pill-shaped (`rounded-full`) with a 1px `border-muted`,
  2px×12px padding, and 12px Medium text. Hover deepens the border and text
  color. Tags link to filtered tag pages.

- **Input Fields:** `bg-surface` background, 6px radius, 1px `ring-muted`,
  8px×12px padding. Focus transitions to a 2px `ring-accent` with
  `ring-inset`. Placeholder text is `text-tertiary`.

- **Navigation Links:** A custom underline animation via a `::before`
  pseudo-element that scales from 0 to 100% on hover. Active links keep the
  underline visible at `text-primary`. External links open in new tabs.

- **Blockquotes:** A 4px amber left border (`border-quote-accent/60`), 8px
  right radius, 16px×24px padding. Body text is italic, 18px,
  `text-secondary-strong`. Optional `<figcaption>` attribution in
  `text-secondary-muted`, 14px.

- **Theme Toggle:** A 24px×24px icon button with a subtle scale-up on hover
  (`hover:scale-105`). Animates the icon swap with a 30° rotation via
  Framer Motion's `AnimatePresence`.

- **Rough Charts:** Data visualisations use RoughJS for a hand-drawn sketch
  aesthetic. Charts render as inline SVG with hachure fills and currentColor
  strokes, respecting the light/dark theme.

## Do's and Don'ts

- Do use `accent` only for the single most important action per screen
- Color tokens handle dark mode via CSS variables — do not use `dark:`
  prefixes for color utilities (use `text-primary`, not
  `text-primary dark:text-primary-inverse`)
- Do keep body text within 65ch for readability
- Do use Work Sans for everything — do not introduce a second type family
- Don't mix rounded corners on the same element (sharp left + rounded right
  on blockquotes is the only intentional exception)
- Don't use shadows heavier than `shadow-lg` — the design relies on tonal
  separation, not depth
- Don't use `accent` for non-interactive decorative elements — reserve it for
  actions and focus states
- Do maintain the 8px spacing rhythm — avoid arbitrary pixel values
- Do animate with purpose — under 300ms transitions, `ease-in-out` timing
