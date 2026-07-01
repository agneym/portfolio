interface QuoteProps {
  children: React.ReactNode;
  author?: string;
}

export function Quote({ children, author }: QuoteProps) {
  return (
    <figure className="my-10 flex flex-col gap-3 rounded-r-lg border-l-4 border-amber-500/60 px-6 py-4">
      <blockquote className="text-lg leading-relaxed text-slate-700 italic dark:text-slate-200">
        {children}
      </blockquote>
      {author && (
        <figcaption className="text-sm text-slate-500 not-italic dark:text-slate-400">
          &mdash; {author}
        </figcaption>
      )}
    </figure>
  );
}
