import { lazy } from "react";
import { Link } from "@tanstack/react-router";
import { mdxComponents } from "@prose-ui/react";
import { PlaygroundWrapper } from "components/uikit/PlaygroundWrapper";

// Post-specific components are lazy-loaded so they only ship to the posts
// that actually use them, rather than bloating every blog post's bundle.
const BubblingVisualizer = lazy(() =>
  import("components/BlogHome/PostComponents/BubblingVisualizer").then((m) => ({
    default: m.BubblingVisualizer,
  })),
);
const SynEventViewer = lazy(() =>
  import("components/BlogHome/PostComponents/SynEventViewer").then((m) => ({
    default: m.SynEventViewer,
  })),
);
const EventDelegationCode = lazy(() =>
  import("components/BlogHome/PostComponents/EventDelegationCode").then(
    (m) => ({ default: m.EventDelegationCode }),
  ),
);
const PropagationVisualizer = lazy(() =>
  import("components/BlogHome/PostComponents/PropagationVisualizer").then(
    (m) => ({ default: m.PropagationVisualizer }),
  ),
);
const CascadePipeline = lazy(() =>
  import("components/BlogHome/PostComponents/CascadePipeline").then((m) => ({
    default: m.CascadePipeline,
  })),
);
const CascadeOriginsQuiz = lazy(() =>
  import("components/BlogHome/PostComponents/CascadeOriginsQuiz").then((m) => ({
    default: m.CascadeOriginsQuiz,
  })),
);
const ImportanceQuiz = lazy(() =>
  import("components/BlogHome/PostComponents/ImportanceQuiz").then((m) => ({
    default: m.ImportanceQuiz,
  })),
);
const NotifyOnChangePropsPlayground = lazy(() =>
  import("components/BlogHome/PostComponents/NotifyOnChangePropsPlayground").then(
    (m) => ({
      default: m.NotifyOnChangePropsPlayground,
    }),
  ),
);
const RoughBarChart = lazy(() =>
  import("components/BlogHome/PostComponents/RoughBarChart").then((m) => ({
    default: m.RoughBarChart,
  })),
);
const RtkComparison = lazy(() =>
  import("components/BlogHome/PostComponents/RtkComparison").then((m) => ({
    default: m.RtkComparison,
  })),
);
const DonutChart = lazy(() =>
  import("components/BlogHome/PostComponents/DonutChart").then((m) => ({
    default: m.DonutChart,
  })),
);
const HorizontalStackedBarChart = lazy(() =>
  import("components/BlogHome/PostComponents/HorizontalStackedBarChart").then(
    (m) => ({
      default: m.HorizontalStackedBarChart,
    }),
  ),
);
import { Quote } from "components/BlogHome/PostComponents/Quote";

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
  CascadePipeline,
  CascadeOriginsQuiz,
  ImportanceQuiz,
  NotifyOnChangePropsPlayground,
  RoughBarChart,
  RtkComparison,
  DonutChart,
  HorizontalStackedBarChart,
  Quote,
};
