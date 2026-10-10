---
version: 1
slug: "src-app-index-tsx"
primary_target: "src/app/index.tsx"
related_targets: ["src/app/blog","src/app/webmarks","src/app/design.tsx"]
---

## Scope

Whole-site redesign of agney.dev. Home `/` is Experience mode; `/blog` and posts are Read; `/webmarks` is Operate; `/design` documents the system. All share one world.

Audience: web developers reading a post or sizing Agney up. Job: meet Agney in one viewport, then get to the writing, the webmarks, or the newsletter. Constraints: keep content, routes, demos, dark mode, reduced motion, AA contrast.

Run note: unattended. The decision page and comp round were not held (no one to answer, no image generation); the assigned direction was built code-led and the assumptions are listed in the PR.

## Direction contract

THESIS: The site is a custom mechanical keyboard in Agney's own colorway: everything you press is a keycap that travels, and the real keyboard drives it. Refuses the centred-avatar-plus-name hero and the dark terminal costume.

OWN-WORLD: "Clack" colorway. Lilac plate (light) or plum plate (dark); white or graphite alpha keys with a darker skirt below the dish; teal modifiers; hot pink reserved for the pressed or active key; lemon for highlight and selection. Unbounded for legends and display, Atkinson Hyperlegible Next for reading, Martian Mono only for code and kbd.

STORY: Visitors see Agney's name typed out in keycaps, press one (or their own keyboard), find the shortcuts, then go read.

FIRST VIEWPORT: A tilted keyboard plate across the top half: row one "AGNEY" alpha keys plus an artisan Esc key with the avatar, row two "MENON", a spacebar reading "Web Developer. Storyteller." Nav keys (Blog, Webmarks, Projects, Newsletter) sit as a modifier row with their shortcut letters. "Hey, I'm" sits above, a "press ? for shortcuts" hint below.

FORM: Mechanical keyboard keycap set, candidate 3 of 7 on the grounded list; seed key 26bb738b. Raises: from the paper automata, accent pink belongs only to the key currently pressed or active. From the star atlas, hierarchy comes from fixed keycap unit widths (1u, 1.5u, 2u, 6.25u), not from extra type sizes. From the CD-ROM console, the active nav key stays pressed into the plate and disabled keys sit flat.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
