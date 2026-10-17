import { Link } from "@tanstack/react-router";
import { DateString } from "components/BlogHome/DateString";

interface IssueListItemProps {
  slug: string;
  shortTitle: string;
  date: string;
  excerpt: string;
}

export function IssueListItem({
  slug,
  shortTitle,
  date,
  excerpt,
}: IssueListItemProps) {
  return (
    <article className="flex flex-col gap-y-2 py-5">
      <header className="flex flex-col gap-y-1.5">
        <h3 className="font-sans text-xl leading-snug font-bold text-pretty sm:text-[1.375rem]">
          <Link
            to="/newsletter/$slug"
            params={{ slug }}
            className="group text-primary rounded-sm"
          >
            <span className="marker">{shortTitle}</span>
          </Link>
        </h3>
        <DateString className="text-secondary-muted tabular text-sm">
          {date}
        </DateString>
      </header>
      {excerpt ? (
        <p className="text-secondary line-clamp-2 text-pretty">{excerpt}</p>
      ) : null}
    </article>
  );
}
