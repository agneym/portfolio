---
version: alpha
name: Clack
description: A custom mechanical keyboard in Agney's own colorway. Everything you press is a keycap with real travel, and the real keyboard drives it. Light and dark are two plates of the same set.
colors:
  surface: "#eae1fe"
  plate-deep: "#dbcef8"
  key: "#fcfbff"
  skirt: "#c2b7da"
  muted: "#cfc4e7"
  primary: "#25193f"
  secondary-strong: "#382d55"
  secondary: "#4a4069"
  secondary-muted: "#5a5176"
  tertiary: "#5d5479"
  mod: "#006a68"
  mod-skirt: "#004847"
  text-on-mod: "#fcfbff"
  accent: "#c81c71"
  accent-skirt: "#8e024d"
  accent-light: "#ffdbe8"
  text-on-accent: "#fcfbff"
  lemon: "#f8e94c"
  text-on-lemon: "#25193f"
colors-dark:
  surface: "#1a142b"
  plate-deep: "#110b1f"
  key: "#302844"
  skirt: "#0d071a"
  muted: "#3a334f"
  primary: "#f3f0fb"
  secondary-strong: "#e0dbed"
  secondary: "#cdc7dc"
  secondary-muted: "#b5acc7"
  tertiary: "#aea6c1"
  mod: "#37c9bf"
  mod-skirt: "#027972"
  text-on-mod: "#130d21"
  accent: "#fd77aa"
  accent-skirt: "#ac3668"
  accent-light: "#551b33"
  text-on-accent: "#130d21"
  lemon: "#e9dc4b"
  text-on-lemon: "#181128"
typography:
  display:
    fontFamily: Unbounded
    fontSize: clamp(3.25rem, 9vw, 6rem)
    fontWeight: 700
    lineHeight: 0.95
    letterSpacing: "-0.03em"
  h1:
    fontFamily: Unbounded
    fontSize: clamp(2.125rem, 5.5vw, 3.75rem)
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.025em"
  h2:
    fontFamily: Unbounded
    fontSize: 1.625rem
    fontWeight: 650
    lineHeight: 1.4
    letterSpacing: "-0.02em"
  legend:
    fontFamily: Unbounded
    fontSize: 1rem
    fontWeight: 600
    lineHeight: 1
  body-lg:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 1.25rem
    fontWeight: 400
    lineHeight: 1.5
  body:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 1.125rem
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 0.875rem
    fontWeight: 700
    lineHeight: 1.2
  code:
    fontFamily: Martian Mono
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.7
rounded:
  tag: 8px
  key: 12px
  card: 16px
  plate: 28px
spacing:
  travel: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  2xl: 64px
  1u: 96px
components:
  keycap-alpha:
    backgroundColor: "{colors.key}"
    textColor: "{colors.primary}"
    rounded: "{rounded.key}"
    typography: "{typography.legend}"
  keycap-mod:
    backgroundColor: "{colors.mod}"
    textColor: "{colors.text-on-mod}"
    rounded: "{rounded.key}"
    padding: 10px 16px
    typography: "{typography.label}"
  keycap-pressed:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.text-on-accent}"
    rounded: "{rounded.key}"
  keycap-plain:
    backgroundColor: "{colors.plate-deep}"
    textColor: "{colors.primary}"
    rounded: "{rounded.key}"
  tag-key:
    backgroundColor: "{colors.plate-deep}"
    textColor: "{colors.primary}"
    rounded: "{rounded.tag}"
    padding: 4px 10px
  key-well:
    backgroundColor: "{colors.key}"
    textColor: "{colors.primary}"
    rounded: "{rounded.key}"
    padding: 10px 14px
  card:
    backgroundColor: "{colors.key}"
    textColor: "{colors.primary}"
    rounded: "{rounded.card}"
    padding: 20px
  highlight:
    backgroundColor: "{colors.lemon}"
    textColor: "{colors.text-on-lemon}"
---

## Overview

**Creative North Star: "The custom board."** agney.dev is a mechanical
keyboard built in Agney's own colorway, called Clack. The home page is the
board itself: his name typed out in alpha keys, an artisan Esc key carrying
his avatar, the site's sections as teal modifier keys, and a spacebar that
reads "Web Developer. Storyteller." Every other page is built from the same
parts: plates, keycaps, wells, and legends.

The world is playful and physical but never in the way of reading. Keys
travel when pressed, the real keyboard presses the keys on screen, and the
board hides a couple of secrets. The blog keeps the world in its chrome and
lets long-form text sit quietly on the plate.

**Key Characteristics:**

- Keycaps with real travel: a side wall (skirt) under the cap, a soft cast
  shadow, and a press that drops the cap into the plate.
- A four-role colorway: lilac plate, white or graphite alphas, teal
  modifiers, hot pink for whatever is pressed, lemon for highlights.
- A wide, round display face for legends and headlines; a hyper-legible
  reading face for everything long.
- Keyboard first: single-key shortcuts for every section, a `?` sheet, and
  a switch to turn them off.

## Colors

Light and dark are two plates of the same set: the same token names flip
values under `.dark` (CSS custom properties in `src/app/global.css`), so
components never need `dark:` variants for system colours.

- **Plate (surface #eae1fe / dark #1a142b):** the page ground. A lilac case
  in light mode and a plum case at night.
- **Plate deep (#dbcef8 / #110b1f):** the board's bed, recessed panels,
  filter bars, empty states, and plain keys.
- **Key (#fcfbff / #302844):** the alpha keycap. Raised reading and control
  surfaces: cards, code blocks, the newsletter panel, inputs.
- **Skirt (#c2b7da / #0d071a):** a keycap's side wall, drawn as the
  zero-blur shadow under every key.
- **Ink (primary #25193f / #f3f0fb, then secondary-strong, secondary,
  secondary-muted, tertiary):** plum-tinted text steps. Every step passes AA
  on plate, plate-deep, and key in both themes.
- **Mod (#006a68 / #37c9bf):** teal modifier keys: navigation, primary
  actions, year keys, link underlines.
- **Accent (#c81c71 / #fd77aa):** hot pink.
- **Lemon (#f8e94c / #e9dc4b):** the highlighter: text selection, link hover
  marks, the Enter key, "Digital Garden".

**The Pressed Pink Rule.** Pink belongs only to the key that is pressed or
active: the current page's nav key, a key under your finger, a selected
tag, the focus ring. Never use it as decoration.

**The Tinted Ink Rule.** No grey and no pure black. Every neutral is tinted
from the plate's plum hue.

## Typography

- **Unbounded** (variable, 200 to 900) is the legend and display voice:
  page titles, post titles, headings, key legends. Wide, round terminals,
  like printed keycap legends.
- **Atkinson Hyperlegible Next** (variable, with italics) sets body copy,
  labels, controls, and post lists. Built for legibility, which suits a
  site whose product is reading.
- **Martian Mono** (variable width and weight) is for code, `kbd`, and
  data such as ordinals. Code blocks set it at 75% width so lines fit.

All three are self-hosted through `@fontsource-variable/*`; there are no
font CDNs. The Unbounded latin file is preloaded from `__root.tsx`.

### Hierarchy

Display (6rem max) is reserved for section names (Blog, Webmarks). Post
titles use h1 (clamp to 3.75rem). Article h2/h3 step down in Unbounded;
body is 1.125rem / 1.8 at 68ch.

**The Unit Rule.** Hierarchy on the board comes from keycap width on a
fixed unit ramp (1u, 1.25u, 1.5u, 2u, 5u spacebar), not from extra type
sizes.

## Layout

- The home page is the board plus a "Latest writing" column; it rotates
  -2deg on wide screens and sits flat on phones. The board is a 32-column
  grid (a quarter-unit per column) sized by `--u`.
- Blog index: display title and newsletter panel share the header; posts
  group by year, with the year as a sticky teal key.
- Posts: a 68ch column with full-bleed escapes for interactive demos.
- Webmarks: display title, a sticky filter bar (search well, sort, tag keys),
  and a 1/2/3-column card grid.
- Breakpoints: Tailwind defaults (640, 768, 1024, 1280). Nav collapses to a
  menu key below 768px; the home layout goes side by side at 1280px.

## Elevation & Depth

Depth is physical, not ambient. A raised key carries three shadows: an
inset top highlight, a zero-blur skirt (`0 var(--travel) 0 skirt`), and a
soft cast shadow (`0 calc(travel + 4px) 12px -2px`). Pressing moves the cap
down by the travel (4px, 3px on small keys, 2px on tags) and collapses the
skirt. Wells (inputs) invert it: an inset skirt at the top.

**The Travel Rule.** The zero-blur shadow is only ever a keycap's wall,
always paired with a blurred cast shadow, always collapsing on press.

## Shapes

Radii scale with the object: 8px tags, 12px keys, 16px cards and code
blocks, 28px plates and panels. No pills: even tags are small keys.

## Components

### Keycaps (`.keycap`)

One class, four caps: alpha (`keycap`, key white), plain (`keycap-plain`,
plate-deep), light (`keycap-light`), and mod (`keycap-mod`, teal). Any
keycap that is `:active`, `[aria-current="page"]`, `[aria-pressed="true"]`
or `[data-pressed="true"]` turns pink and drops. Disabled keys sit flat.

### Navigation

Header nav keys carry their shortcut letter as a top-left legend. The
current page's key stays pressed. The `?` key opens the shortcut sheet and
the teal theme key swaps the plate.

### Inputs (`.key-well`)

Inputs are the holes keys sit in: key-coloured, inset skirt at the top,
pink focus ring.

### Cards

Webmark cards are big keycaps: key surface, 16px radius, skirt and cast
shadow, lift on hover, drop when the link is pressed.

### Signature: the board

`KeyboardHero` lays the name out on a plate. Letters press on tap or on the
matching physical key; the Enter key says hi; typing "agney" or "menon"
sends a wave down the rows. The Konami code turns on RGB underglow across
every keycap on the site. The bottom row ends in a sound key: a plain cap
with a Caps-Lock-style lock-light that glows lemon while key sounds are on.

### Sound & haptics

The board can be heard and felt, but only when asked.

- **Sound is opt-in.** Off by default; turn it on with the sound key, the
  `s` shortcut, or the switch in the `?` sheet. The choice persists in
  `localStorage` (`clack:sound`).
- **Synthesized, not sampled.** Web Audio only, no audio files
  (`src/components/shared/feedback/audio.ts`). A key is a band-passed
  noise burst (the click) over a sine that drops in pitch (the thump), with
  small random variation in pitch, filter and level on every press. Alphas
  clack bright, the spacebar and Enter thock low with a stabiliser rattle,
  modifier and nav keys tick light. Spelling the name rolls a five-note
  pentatonic arpeggio with the wave; the Konami code plays an 8-bit
  power-up. Everything sits under a quiet master gain and a limiter.
- **Haptics** are a short `navigator.vibrate` tap on finger presses only,
  on touch devices that support it (Android). On by default there, off by
  default under `prefers-reduced-motion`, with their own switch in the
  sheet (`clack:haptics`). iOS Safari has no Vibration API, so iPhones get
  none.
- **Zero cost up front.** Audio and haptics are separate chunks loaded with
  `import()` on idle (if a setting needs them) or when the visitor first
  reaches for the board. The AudioContext is only created inside a gesture.

## Do's and Don'ts

### Do:

- **Do** build every control as a keycap or a well, with real travel.
- **Do** keep pink for the pressed or active state only.
- **Do** keep long-form reading quiet: ink on plate, Atkinson at 68ch.
- **Do** give every motion a `prefers-reduced-motion` path; the board's
  wave and RGB cycle stop, presses still change colour.
- **Do** keep single-key shortcuts switchable (WCAG 2.1.4) from the `?`
  sheet.
- **Do** keep sound opt-in and quiet, and every feedback lazy-loaded.

### Don't:

- **Don't** use grey or pure black; tint from the plum hue.
- **Don't** use a zero-blur shadow on anything that is not a keycap.
- **Don't** add eyebrow labels, numbered section markers, or side-stripe
  borders.
- **Don't** set body copy in Unbounded or mono; they are legends and code.
- **Don't** load fonts from a CDN.
