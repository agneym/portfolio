import { createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { HeadNav } from "components/HomePage";
import { Quote } from "components/BlogHome/PostComponents/Quote";
import { TagBadge } from "components/BlogHome/TagBadge";
import { SkipNavContent } from "components/uikit/SkipNav";
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
  "colors-dark"?: Record<string, string>;
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
      <div className="relative flex h-20 overflow-hidden rounded-xl shadow-[inset_0_0_0_1px_var(--color-muted),0_3px_0_var(--color-skirt)]">
        <div className="flex-1" style={{ backgroundColor: hex }} />
        {dark && (
          <div className="flex-1" style={{ backgroundColor: darkHex }} />
        )}
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-primary text-sm font-bold">{name}</span>
        <span className="text-secondary font-mono text-[0.6875rem]">
          {hex}
          {dark && <> / {darkHex}</>}
        </span>
      </div>
    </div>
  );
}

function TypeSample({ name, token }: { name: string; token: TypographyToken }) {
  return (
    <div className="border-muted flex flex-col gap-2 border-b py-5 last:border-b-0">
      <span className="text-secondary text-sm font-bold">{name}</span>
      <p
        style={{
          fontFamily: `"${token.fontFamily} Variable", sans-serif`,
          fontSize: token.fontSize,
          fontWeight: token.fontWeight,
          lineHeight: token.lineHeight,
          letterSpacing: token.letterSpacing,
        }}
        className="text-primary truncate"
      >
        Clack clack, Agney
      </p>
      <span className="text-secondary-muted font-mono text-[0.6875rem]">
        {token.fontFamily}, {token.fontSize}, {token.fontWeight},{" "}
        {token.lineHeight}
        {token.letterSpacing ? `, ${token.letterSpacing}` : ""}
      </span>
    </div>
  );
}

function SpacingBar({ name, value }: { name: string; value: string }) {
  const px = parseInt(value, 10);
  return (
    <div className="flex items-center gap-4">
      <span className="text-primary w-14 text-right text-sm font-bold">
        {name}
      </span>
      <span className="text-secondary w-14 font-mono text-[0.6875rem]">
        {value}
      </span>
      <div className="relative h-6 min-w-0 flex-1 overflow-hidden">
        <div
          className="bg-mod absolute top-0 left-0 h-full rounded-md"
          style={{ width: Math.min(px * 3, 288) }}
        />
      </div>
    </div>
  );
}

function RadiusPreview({ name, value }: { name: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="bg-key size-16 shadow-[0_4px_0_var(--color-skirt)]"
        style={{ borderRadius: value }}
      />
      <span className="text-primary text-sm font-bold">{name}</span>
      <span className="text-secondary font-mono text-[0.6875rem]">{value}</span>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-primary text-2xl font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function Panel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-key rounded-[var(--radius-plate)] p-6 shadow-[inset_0_1px_0_var(--key-highlight),0_5px_0_var(--color-skirt)] sm:p-8 ${className ?? ""}`}
    >
      {children}
    </div>
  );
}

function Prose({ md }: { md: string }) {
  return (
    <div
      className="text-secondary-strong [&_code]:bg-plate-deep [&_strong]:text-primary space-y-3 text-base text-pretty [&_code]:rounded [&_code]:px-1 [&_code]:text-sm [&_li]:ml-5 [&_li]:list-disc [&_strong]:font-bold"
      dangerouslySetInnerHTML={{ __html: mdToHtml(md) }}
    />
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
  const darkColors = tokens["colors-dark"] ?? {};

  return (
    <div className="bg-surface min-h-full">
      <HeadNav />
      <SkipNavContent />
      <header className="mx-auto max-w-5xl px-4 pt-14 pb-10 sm:px-8 sm:pt-20">
        <h1 className="text-primary text-[clamp(3.25rem,9vw,6rem)] leading-[0.95] font-bold tracking-[-0.03em]">
          {tokens.name}
        </h1>
        <p className="text-secondary-strong mt-5 max-w-2xl text-xl text-pretty">
          {tokens.description}
        </p>
      </header>

      <main className="mx-auto flex max-w-5xl flex-col gap-y-20 px-4 pb-24 sm:px-8">
        <Section title="Colors">
          <p className="text-secondary -mt-2">
            Left half light plate, right half dark plate.
          </p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4">
            {Object.entries(tokens.colors).map(([name, hex]) => (
              <ColorSwatch
                key={name}
                name={name}
                hex={hex}
                darkHex={darkColors[name]}
              />
            ))}
          </div>
          {sections["Colors"] && (
            <Panel>
              <Prose md={sections["Colors"]} />
            </Panel>
          )}
        </Section>

        <Section title="Typography">
          <Panel className="py-2 sm:py-2">
            {Object.entries(tokens.typography).map(([name, token]) => (
              <TypeSample key={name} name={name} token={token} />
            ))}
          </Panel>
        </Section>

        <Section title="Spacing">
          <Panel className="space-y-3">
            {Object.entries(tokens.spacing).map(([name, value]) => (
              <SpacingBar key={name} name={name} value={value} />
            ))}
          </Panel>
        </Section>

        <Section title="Radius">
          <div className="flex flex-wrap items-end gap-10">
            {Object.entries(tokens.rounded).map(([name, value]) => (
              <RadiusPreview key={name} name={name} value={value} />
            ))}
          </div>
        </Section>

        <Section title="Components">
          <Panel className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <h3 className="text-primary text-base font-semibold">Keycaps</h3>
              <div className="flex flex-wrap items-center gap-4">
                <span className="keycap font-display size-16 text-2xl font-semibold">
                  A
                </span>
                <button
                  type="button"
                  className="keycap keycap-mod px-5 py-3 font-bold"
                >
                  Mod key
                </button>
                <button
                  type="button"
                  className="keycap keycap-plain px-5 py-3 font-bold"
                >
                  Plain key
                </button>
                <span
                  data-pressed="true"
                  className="keycap px-5 py-3 font-bold"
                >
                  Pressed
                </span>
                <button
                  type="button"
                  disabled
                  className="keycap keycap-plain px-5 py-3 font-bold"
                >
                  Disabled
                </button>
              </div>
              <p className="text-secondary text-sm">
                Press and hold any key to see its travel.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="text-primary text-base font-semibold">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {["react", "css", "javascript", "agents"].map((tag) => (
                  <TagBadge key={tag} tag={tag} />
                ))}
              </div>
            </div>
            <div className="flex max-w-sm flex-col gap-3">
              <h3 className="text-primary text-base font-semibold">Wells</h3>
              <input
                type="text"
                placeholder="address@example.ext"
                aria-label="Example email input"
                className="key-well text-primary placeholder:text-tertiary focus:ring-accent w-full border-0 px-3.5 py-2.5 focus:ring-2"
              />
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="text-primary text-base font-semibold">
                Highlight
              </h3>
              <p className="text-secondary-strong">
                Links get a{" "}
                <span className="group">
                  <span className="marker text-primary font-bold">
                    lemon marker
                  </span>
                </span>{" "}
                on hover, and selections are lemon too.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="text-primary text-base font-semibold">Quote</h3>
              <Quote author="Clack design rule">
                Pink belongs to the key under your finger.
              </Quote>
            </div>
          </Panel>
        </Section>

        {sections["Do's and Don'ts"] && (
          <Section title="Do's and Don'ts">
            <Panel>
              <Prose md={sections["Do's and Don'ts"]} />
            </Panel>
          </Section>
        )}
      </main>
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
