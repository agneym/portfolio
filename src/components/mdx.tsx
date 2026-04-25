import { Link } from "@tanstack/react-router";
import { codeToHtml } from "shiki";
import { useState, useEffect } from "react";
import { PlaygroundWrapper } from "components/uikit/PlaygroundWrapper";
import { BubblingVisualizer } from "components/BlogHome/PostComponents/BubblingVisualizer";
import { SynEventViewer } from "components/BlogHome/PostComponents/SynEventViewer";
import { EventDelegationCode } from "components/BlogHome/PostComponents/EventDelegationCode";
import { PropagationVisualizer } from "components/BlogHome/PostComponents/PropagationVisualizer";

function Table({ data }: { data: { headers: string[]; rows: string[][] } }) {
  let headers = data.headers.map((header, index) => (
    <th key={index}>{header}</th>
  ));
  let rows = data.rows.map((row, index) => (
    <tr key={index}>
      {row.map((cell, cellIndex) => (
        <td key={cellIndex}>{cell}</td>
      ))}
    </tr>
  ));

  return (
    <table>
      <thead>
        <tr>{headers}</tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function CustomLink({
  href = "",
  children,
  className,
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  if (href.startsWith("/")) {
    return (
      <Link to={href} className={className}>
        {children}
      </Link>
    );
  }
  if (href.startsWith("#")) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  );
}

function RoundedImage(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  return <img alt={props.alt} className="rounded-lg" {...props} />;
}

function Code({ children, ...props }: React.HTMLAttributes<HTMLElement>) {
  const lang = props.className?.replace("language-", "");
  if (lang) {
    const [html, setHtml] = useState("");
    useEffect(() => {
      void codeToHtml(String(children), {
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

function slugify(str: string) {
  if (!str) return "";
  return str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/&/g, "-and-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

function createHeading(level: number) {
  const Heading = ({ children }: { children: React.ReactNode }) => {
    let slug = slugify(String(children ?? ""));
    const headingContent = (
      <>
        {level === 1 && (
          <h1 id={slug} className="anchor">
            {children}
          </h1>
        )}
        {level === 2 && (
          <h2 id={slug} className="anchor">
            {children}
          </h2>
        )}
        {level === 3 && (
          <h3 id={slug} className="anchor">
            {children}
          </h3>
        )}
        {level === 4 && (
          <h4 id={slug} className="anchor">
            {children}
          </h4>
        )}
        {level === 5 && (
          <h5 id={slug} className="anchor">
            {children}
          </h5>
        )}
        {level === 6 && (
          <h6 id={slug} className="anchor">
            {children}
          </h6>
        )}
      </>
    );
    return (
      <a href={`#${slug}`} className="no-underline">
        {headingContent}
      </a>
    );
  };

  Heading.displayName = `Heading${level}`;

  return Heading;
}

function Pre({ children }: { children: React.ReactNode }) {
  return children;
}

// Temporary backward-compat export for old Next.js pages during migration.
// The new routes use MDXContent directly with compiled MDX code.
export function CustomMDX({ source }: { source: string }) {
  return (
    <div>
      {/* MDXContent requires compiled MDX code; this wrapper is transitional */}
      <pre>{source}</pre>
    </div>
  );
}

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
  pre: Pre,
  Table,
  Playground: PlaygroundWrapper,
  BubblingVisualizer,
  SynEventViewer,
  EventDelegationCode,
  PropagationVisualizer,
};
