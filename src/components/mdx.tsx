import { Link } from "@tanstack/react-router";
import { mdxComponents } from "@prose-ui/react";
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
  ...mdxComponents,
  Link: CustomLink,
  Table,
  Playground: PlaygroundWrapper,
  BubblingVisualizer,
  SynEventViewer,
  EventDelegationCode,
  PropagationVisualizer,
};
