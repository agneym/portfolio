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
    <article className="group/post relative flex flex-col gap-y-3 py-5">
      <header className="flex flex-col gap-y-1.5">
        <h3 className="font-sans text-xl leading-snug font-bold text-pretty sm:text-[1.375rem]">
          <Link
            to="/blog/$slug"
            params={{ slug }}
            className="group text-primary rounded-sm"
          >
            <span className="marker">{meta.title}</span>
          </Link>
        </h3>
        <DateString className="text-secondary-muted tabular text-sm">
          {meta.date}
        </DateString>
      </header>
      {meta.tags && meta.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pb-1">
          {meta.tags.map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>
      )}
    </article>
  );
}
