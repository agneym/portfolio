interface QuoteProps {
  children: React.ReactNode;
  author?: string;
}

export function Quote({ children, author }: QuoteProps) {
  return (
    <figure className="border-quote-accent/60 my-10 flex flex-col gap-3 rounded-r-lg border-l-4 px-6 py-4">
      <blockquote className="text-secondary-strong text-lg leading-relaxed italic">
        {children}
      </blockquote>
      {author && (
        <figcaption className="text-secondary-muted text-sm not-italic">
          &mdash; {author}
        </figcaption>
      )}
    </figure>
  );
}
