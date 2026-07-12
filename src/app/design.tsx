import { createFileRoute } from "@tanstack/react-router";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import clsx from "clsx";
import designMdRaw from "../../DESIGN.md?raw";

// ── Parser ──────────────────────────────────────────────────────────────────

interface TypographyToken {
  fontFamily: string;
  fontSize: string;
  fontWeight: number;
  lineHeight: number;
  letterSpacing?: string;
}

interface ComponentToken {
  backgroundColor?: string;
  textColor?: string;
  rounded?: string;
  padding?: string;
  typography?: string;
}

interface DesignTokens {
  name: string;
  description: string;
  colors: Record<string, string>;
  typography: Record<string, TypographyToken>;
  rounded: Record<string, string>;
  spacing: Record<string, string>;
  components: Record<string, ComponentToken>;
}

function parseFrontMatter(raw: string): {
  tokens: DesignTokens;
  body: string;
} {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error("No YAML front matter found in DESIGN.md");

  const yaml = match[1]!;
  const body = match[2]!;

  // Parse flat and nested YAML (handles the DESIGN.md structure)
  const tokens: Record<string, unknown> = {};
  const lines = yaml.split("\n");
  let currentPath: string[] = [];
  let currentObj: Record<string, unknown> | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;
    if (!line.trim()) continue;

    const indent = line.search(/\S/);
    const trimmed = line.trim();

    // Comment
    if (trimmed.startsWith("#")) continue;

    const kvMatch = trimmed.match(/^([\w-]+):\s*(.*)$/);
    if (!kvMatch) continue;

    const key = kvMatch[1]!;
    const rawValue = kvMatch[2]!;
    let value: unknown = rawValue.trim();

    // Detect nested objects (next line is indented)
    const nextLine = i + 1 < lines.length ? lines[i + 1] : "";
    const nextIndent = nextLine ? nextLine.search(/\S/) : -1;

    if (nextIndent > indent && nextLine && nextLine.trim().match(/^[\w-]+:/)) {
      // This is a section header (colors:, typography:, etc.)
      currentPath =
        indent === 0 ? [key] : [...currentPath.slice(0, indent / 2), key];
      currentObj = {};
      setNested(tokens, currentPath, currentObj);
      continue;
    }

    if (indent === 0) {
      // Top-level scalar
      if (value === "" || value === "{}") value = "";
      else if (
        /^-?\d/.test(value as string) &&
        !(value as string).startsWith('"')
      )
        value = parseFloat(value as string);
      else value = unquote(value as string);
      currentPath = [key];
      setNested(tokens, currentPath, value);
      continue;
    }

    // Indented key-value — goes into currentObj
    const parentPath =
      indent >= 2 ? currentPath : currentPath.slice(0, Math.max(0, indent / 2));
    const fullPath = [...parentPath, key];

    // Handle quoted strings, numbers, references
    let parsed: unknown = value;
    if (value === "" || value === "{}") {
      parsed = "";
    } else if (typeof value === "string") {
      const unquoted = unquote(value as string);
      if (
        /^-?\d/.test(unquoted) &&
        !unquoted.includes(" ") &&
        !unquoted.includes("{")
      ) {
        // Could be a number or a dimension — keep as string for dimensions
        if (unquoted.match(/^-?\d+(\.\d+)?(px|em|rem|%)$/)) {
          parsed = unquoted;
        } else if (unquoted.match(/^-?\d+(\.\d+)?$/)) {
          parsed = parseFloat(unquoted);
        } else {
          parsed = unquoted;
        }
      } else {
        parsed = unquoted;
      }
    }

    setNested(tokens, fullPath, parsed);
  }

  return {
    tokens: tokens as unknown as DesignTokens,
    body,
  };
}

function unquote(s: string): string {
  const t = s.trim();
  if (
    (t.startsWith('"') && t.endsWith('"')) ||
    (t.startsWith("'") && t.endsWith("'"))
  ) {
    return t.slice(1, -1);
  }
  return t;
}

function setNested(
  obj: Record<string, unknown>,
  path: string[],
  value: unknown,
) {
  let current: Record<string, unknown> = obj;
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i]!;
    if (!(key in current)) current[key] = {};
    current = current[key] as Record<string, unknown>;
  }
  const lastKey = path[path.length - 1]!;
  current[lastKey] = value;
}

// ── Parse markdown sections ─────────────────────────────────────────────────

function parseSections(body: string): Record<string, string> {
  const sections: Record<string, string> = {};
  const headingRegex = /^## (.+)$/gm;
  const matches = [...body.matchAll(headingRegex)];

  for (let i = 0; i < matches.length; i++) {
    const m = matches[i]!;
    const heading = m[1]!.trim();
    const start = (m.index ?? 0) + m[0]!.length;
    const end =
      i + 1 < matches.length
        ? (matches[i + 1]!.index ?? body.length)
        : body.length;
    sections[heading] = body.slice(start, end).trim();
  }

  return sections;
}

// ── Components ──────────────────────────────────────────────────────────────

function ColorSwatch({
  name,
  hex,
  darkHex,
}: {
  name: string;
  hex: string;
  darkHex?: string | undefined;
}) {
  const dark = darkHex !== undefined && darkHex !== hex;

  return (
    <div className="flex flex-col gap-2">
      <div
        className="border-muted relative h-16 overflow-hidden rounded-md border shadow-sm"
        style={{ backgroundColor: hex }}
      >
        {dark && (
          <div
            className="absolute inset-y-0 right-0 w-1/2 border-l border-black/10"
            style={{ backgroundColor: darkHex }}
          />
        )}
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-secondary-strong font-mono text-xs">{name}</span>
        <span className="text-secondary-muted font-mono text-[11px]">
          {hex}
          {dark && (
            <>
              {" "}
              <span className="text-tertiary">/</span> {darkHex}
            </>
          )}
        </span>
      </div>
    </div>
  );
}

function TypeSample({ name, token }: { name: string; token: TypographyToken }) {
  return (
    <div className="border-muted/50 flex flex-col gap-2 border-b py-3 last:border-b-0">
      <span className="text-secondary-muted font-mono text-[11px] tracking-wider uppercase">
        {name}
      </span>
      <p
        style={{
          fontFamily: `"${token.fontFamily} Variable", sans-serif`,
          fontSize: token.fontSize,
          fontWeight: token.fontWeight,
          lineHeight: token.lineHeight,
          letterSpacing: token.letterSpacing,
        }}
        className="text-primary"
      >
        The quick brown fox
      </p>
      <span className="text-tertiary font-mono text-[10px]">
        {token.fontSize} / {token.fontWeight} / {token.lineHeight}
        {token.letterSpacing ? ` / ${token.letterSpacing}` : ""}
      </span>
    </div>
  );
}

function SpacingBar({ name, value }: { name: string; value: string }) {
  const px = parseInt(value, 10);
  return (
    <div className="flex items-center gap-4">
      <span className="text-secondary-strong w-8 text-right font-mono text-xs">
        {name}
      </span>
      <span className="text-tertiary w-14 font-mono text-[11px]">{value}</span>
      <div className="relative h-6 flex-1">
        <div
          className="bg-accent/20 absolute top-0 left-0 h-full rounded"
          style={{ width: Math.min(px * 3, 200) }}
        />
      </div>
    </div>
  );
}

function RadiusPreview({ name, value }: { name: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="bg-accent/20 border-accent/30 size-12 border"
        style={{ borderRadius: value }}
      />
      <span className="text-secondary-muted font-mono text-[10px]">{name}</span>
      <span className="text-tertiary font-mono text-[10px]">{value}</span>
    </div>
  );
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="h-9 w-9" />;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="border-muted flex size-9 items-center justify-center rounded-md border transition-transform hover:scale-105"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-secondary"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-secondary"
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      )}
    </button>
  );
}

// ── Main route ──────────────────────────────────────────────────────────────

export const Route = createFileRoute("/design")({
  head: () => ({
    meta: [{ title: "Design System | Agney" }],
  }),
  component: DesignPage,
});

function DesignPage() {
  const { tokens, body } = parseFrontMatter(designMdRaw);
  const sections = parseSections(body);

  // Build dark mode color map from the Colors prose (for showing dual swatches)
  const darkColors: Record<string, string> = {
    primary: "#f1f5f9",
    secondary: "#94a3b8",
    "secondary-strong": "#cbd5e1",
    "secondary-muted": "#94a3b8",
    tertiary: "#64748b",
    accent: "#6366f1",
    "accent-hover": "#818cf8",
    "accent-muted": "#6366f1",
    "accent-light": "#4f46e5",
    surface: "#1e293b",
    muted: "#334155",
  };

  return (
    <div className="bg-surface min-h-full">
      {/* Header */}
      <header className="border-muted border-b">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-6">
          <div>
            <h1 className="font-heading text-primary text-2xl font-extrabold">
              {tokens.name}
            </h1>
            <p className="text-secondary-muted mt-1 text-sm">
              {tokens.description}
            </p>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-20 px-6 py-12">
        {/* ── Color Palette ──────────────────────────────────────────── */}
        <section>
          <div className="mb-6 flex items-baseline gap-2">
            <span className="text-accent font-mono text-[11px] font-medium tracking-wider uppercase">
              01
            </span>
            <h2 className="font-heading text-primary text-xl font-bold">
              Color Palette
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {Object.entries(tokens.colors).map(([name, hex]) => (
              <ColorSwatch
                key={name}
                name={name}
                hex={hex}
                darkHex={darkColors[name]}
              />
            ))}
          </div>

          {/* Color prose from DESIGN.md */}
          {sections["Colors"] && (
            <div className="border-muted bg-surface mt-8 rounded-lg border p-5">
              <div
                className="text-secondary prose-sm [&_strong]:text-secondary-strong space-y-2 text-sm [&_strong]:font-semibold"
                dangerouslySetInnerHTML={{
                  __html: mdToHtml(sections["Colors"]),
                }}
              />
            </div>
          )}
        </section>

        {/* ── Typography ─────────────────────────────────────────────── */}
        <section>
          <div className="mb-6 flex items-baseline gap-2">
            <span className="text-accent font-mono text-[11px] font-medium tracking-wider uppercase">
              02
            </span>
            <h2 className="font-heading text-primary text-xl font-bold">
              Typography Scale
            </h2>
          </div>
          <div className="border-muted bg-surface rounded-lg border p-6">
            <p className="text-secondary-muted mb-4 font-mono text-xs">
              Work Sans Variable — Variable weight 100–900
            </p>
            {Object.entries(tokens.typography).map(([name, token]) => (
              <TypeSample key={name} name={name} token={token} />
            ))}
          </div>
        </section>

        {/* ── Spacing ────────────────────────────────────────────────── */}
        <section>
          <div className="mb-6 flex items-baseline gap-2">
            <span className="text-accent font-mono text-[11px] font-medium tracking-wider uppercase">
              03
            </span>
            <h2 className="font-heading text-primary text-xl font-bold">
              Spacing Scale
            </h2>
          </div>
          <div className="border-muted bg-surface space-y-3 rounded-lg border p-6">
            {Object.entries(tokens.spacing).map(([name, value]) => (
              <SpacingBar key={name} name={name} value={value} />
            ))}
          </div>
        </section>

        {/* ── Border Radius ──────────────────────────────────────────── */}
        <section>
          <div className="mb-6 flex items-baseline gap-2">
            <span className="text-accent font-mono text-[11px] font-medium tracking-wider uppercase">
              04
            </span>
            <h2 className="font-heading text-primary text-xl font-bold">
              Border Radius
            </h2>
          </div>
          <div className="border-muted bg-surface rounded-lg border p-6">
            <div className="flex flex-wrap items-end justify-center gap-8">
              {Object.entries(tokens.rounded).map(([name, value]) => (
                <RadiusPreview key={name} name={name} value={value} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Components ─────────────────────────────────────────────── */}
        <section>
          <div className="mb-6 flex items-baseline gap-2">
            <span className="text-accent font-mono text-[11px] font-medium tracking-wider uppercase">
              05
            </span>
            <h2 className="font-heading text-primary text-xl font-bold">
              Components
            </h2>
          </div>

          {/* Buttons */}
          <div className="border-muted bg-surface space-y-6 rounded-lg border p-6">
            <h3 className="text-secondary-strong text-sm font-semibold">
              Buttons
            </h3>
            <div className="flex flex-wrap items-center gap-4">
              <button className="bg-accent text-text-on-accent hover:bg-accent-hover focus-visible:outline-accent inline-flex items-center gap-2 rounded-md px-3 py-2 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2">
                Primary Button
              </button>
              <span className="text-tertiary font-mono text-[10px]">
                button-primary
              </span>
            </div>
          </div>

          {/* Tag Badges */}
          <div className="border-muted bg-surface mt-4 space-y-6 rounded-lg border p-6">
            <h3 className="text-secondary-strong text-sm font-semibold">
              Tag Badges
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              {["React", "TypeScript", "Design Systems", "Performance"].map(
                (tag) => (
                  <span
                    key={tag}
                    className="border-muted bg-surface text-secondary hover:text-primary hover:border-secondary-strong inline-flex cursor-default items-center rounded-full border px-1 py-0.5 text-xs font-medium transition-colors"
                  >
                    {tag}
                  </span>
                ),
              )}
            </div>
          </div>

          {/* Input Field */}
          <div className="border-muted bg-surface mt-4 space-y-6 rounded-lg border p-6">
            <h3 className="text-secondary-strong text-sm font-semibold">
              Input Fields
            </h3>
            <div className="max-w-sm">
              <input
                type="text"
                placeholder="Enter your email"
                aria-label="Example email input"
                readOnly
                className="bg-surface ring-muted text-primary placeholder:text-tertiary focus:ring-accent w-full rounded-md px-3 py-2 text-sm ring-1 transition-shadow outline-none focus:ring-2 focus:ring-inset"
              />
            </div>
          </div>

          {/* Nav Links */}
          <div className="border-muted bg-surface mt-4 space-y-6 rounded-lg border p-6">
            <h3 className="text-secondary-strong text-sm font-semibold">
              Navigation Links
            </h3>
            <nav className="flex gap-6" aria-label="Example navigation">
              {["Home", "Blog", "Projects"].map((label, i) => (
                <button
                  key={label}
                  className={clsx(
                    "relative text-sm transition-colors bg-transparent border-0 p-0 cursor-pointer",
                    "after:absolute after:bottom-[-2px] after:left-0 after:h-[2px] after:bg-accent after:transition-transform after:duration-200",
                    i === 0
                      ? "text-primary after:w-full after:scale-x-100"
                      : "text-secondary hover:text-primary after:w-full after:scale-x-0 hover:after:scale-x-100",
                  )}
                >
                  {label}
                </button>
              ))}
            </nav>
          </div>

          {/* Blockquote */}
          <div className="border-muted bg-surface mt-4 space-y-6 rounded-lg border p-6">
            <h3 className="text-secondary-strong text-sm font-semibold">
              Blockquote
            </h3>
            <blockquote className="text-secondary-strong rounded-r-lg border-l-4 border-amber-500/60 px-6 py-4 text-lg italic">
              The best design systems are invisible — they get out of the way
              and let the content speak.
              <figcaption className="text-secondary-muted mt-2 text-sm not-italic">
                — Design System Principle
              </figcaption>
            </blockquote>
          </div>
        </section>

        {/* ── Do's and Don'ts ────────────────────────────────────────── */}
        {sections["Do's and Don'ts"] && (
          <section>
            <div className="mb-6 flex items-baseline gap-2">
              <span className="text-accent font-mono text-[11px] font-medium tracking-wider uppercase">
                06
              </span>
              <h2 className="font-heading text-primary text-xl font-bold">
                Do's & Don'ts
              </h2>
            </div>
            <div className="border-muted bg-surface rounded-lg border p-6">
              <div
                className="text-secondary [&_strong]:text-secondary-strong space-y-2 text-sm"
                dangerouslySetInnerHTML={{
                  __html: mdToHtml(sections["Do's and Don'ts"]),
                }}
              />
            </div>
          </section>
        )}
      </main>

      {/* Back link */}
      <footer className="border-muted border-t">
        <div className="mx-auto max-w-4xl px-6 py-6">
          <a
            href="/"
            className="text-secondary-muted hover:text-secondary text-sm transition-colors"
          >
            ← Back to site
          </a>
        </div>
      </footer>
    </div>
  );
}

// ── Minimal markdown-to-HTML (enough for the DESIGN.md prose) ────────────────

function mdToHtml(md: string): string {
  return (
    md
      // Bold
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      // Italic
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      // Inline code
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      // List items
      .replace(/^- (.+)$/gm, "<li>$1</li>")
      // Headings
      .replace(/^### (.+)$/gm, "<h4>$1</h4>")
      // Paragraphs: wrap blocks separated by blank lines
      .split(/\n\n+/)
      .map((block) => {
        const trimmed = block.trim();
        if (!trimmed) return "";
        if (trimmed.startsWith("<li>")) return `<ul>${trimmed}</ul>`;
        if (trimmed.startsWith("<h")) return trimmed;
        // Code blocks
        if (trimmed.startsWith("```"))
          return `<pre>${trimmed.replace(/```\w*\n?/g, "")}</pre>`;
        return `<p>${trimmed}</p>`;
      })
      .join("\n")
      .replace(/\n/g, " ")
  );
}
