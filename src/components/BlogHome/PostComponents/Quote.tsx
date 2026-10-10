import { Quote as QuoteIcon } from "lucide-react";

interface QuoteProps {
  children: React.ReactNode;
  author?: string;
}

export function Quote({ children, author }: QuoteProps) {
  return (
    <figure className="not-prose bg-key relative my-10 flex flex-col gap-3 rounded-2xl px-6 pt-8 pb-5 shadow-[inset_0_1px_0_var(--key-highlight),0_4px_0_var(--color-skirt)] sm:px-8">
      <QuoteIcon
        aria-hidden
        className="bg-lemon text-text-on-lemon absolute -top-4 left-6 size-9 rounded-xl p-2"
      />
      <blockquote className="text-primary text-lg leading-relaxed font-bold text-pretty">
        {children}
      </blockquote>
      {author && (
        <figcaption className="text-secondary text-sm">{author}</figcaption>
      )}
    </figure>
  );
}
