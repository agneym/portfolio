import Link from "next/link";
import Image from "next/image";
import { MDXRemote } from "next-mdx-remote/rsc";
import { codeToHtml } from "shiki";
import { PlaygroundWrapper } from "components/uikit/PlaygroundWrapper";
import { BubblingVisualizer } from "components/blog/BubblingVisualizer";
import { SynEventViewer } from "components/blog/SynEventViewer";
import { EventDelegationCode } from "components/blog/EventDelegationCode";
import { PropagationVisualizer } from "components/blog/PropagationVisualizer";

function Table({ data }) {
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

function CustomLink(props) {
  let href = props.href;

  if (href.startsWith("/")) {
    return (
      <Link href={href} {...props}>
        {props.children}
      </Link>
    );
  }

  if (href.startsWith("#")) {
    return <a {...props} />;
  }

  return <a target="_blank" rel="noopener noreferrer" {...props} />;
}

function RoundedImage(props) {
  return <Image alt={props.alt} className="rounded-lg" {...props} />;
}

async function Code({ children, ...props }) {
  const lang = props.className?.replace("language-", "");

  if (lang) {
    const codeHTML = await codeToHtml(children, {
      themes: {
        light: "github-light",
        dark: "tokyo-night",
      },
      lang,
    });
    // Shiki's HTML already includes <pre><code> structure, so return it directly
    return <div dangerouslySetInnerHTML={{ __html: codeHTML }} />;
  }

  return <code {...props}>{children}</code>;
}

function slugify(str) {
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

function createHeading(level) {
  const Heading = ({ children }) => {
    let slug = slugify(children);
    return (
      <a href={`#${slug}`} className="no-underline">
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
      </a>
    );
  };

  Heading.displayName = `Heading${level}`;

  return Heading;
}

function Pre({ children }) {
  return children;
}

let components = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  Image: RoundedImage,
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

export function CustomMDX(props) {
  return (
    <MDXRemote
      {...props}
      components={{ ...components, ...(props.components || {}) }}
      options={{
        blockJS: false,
      }}
    />
  );
}
