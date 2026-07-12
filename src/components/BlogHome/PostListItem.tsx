import { Link } from "@tanstack/react-router";
import { DateString } from "./DateString";
import { TagBadge } from "./TagBadge";

interface PostListItemProps {
  meta: {
    title: string;
    date: string;
    tags?: string[];
  };
  slug: string;
}

export function PostListItem({ meta, slug }: PostListItemProps) {
  return (
    <article className="flex flex-col gap-y-4 py-2">
      <header className="flex flex-col gap-y-1">
        <Link to="/blog/$slug" params={{ slug }}>
          <h3 className="text-xl text-balance">{meta.title}</h3>
        </Link>
        <DateString className="text-secondary-muted text-xs">
          {meta.date}
        </DateString>
      </header>
      {meta.tags && meta.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {meta.tags.map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>
      )}
    </article>
  );
}
