import { Link } from "@tanstack/react-router";

interface IssueRef {
  slug: string;
  shortTitle: string;
}

interface IssueNavProps {
  newer: IssueRef | undefined;
  older: IssueRef | undefined;
}

export function IssueNav({ newer, older }: IssueNavProps) {
  return (
    <nav
      aria-label="Other issues"
      className="not-prose mt-16 grid gap-4 sm:grid-cols-2"
    >
      {older ? (
        <Link
          to="/newsletter/$slug"
          params={{ slug: older.slug }}
          rel="prev"
          className="bg-key text-primary flex flex-col gap-y-1 rounded-2xl px-5 py-4 shadow-[inset_0_1px_0_var(--key-highlight),0_4px_0_var(--color-skirt)]"
        >
          <span className="text-secondary text-sm font-bold">
            Previous issue
          </span>
          <span className="font-bold">{older.shortTitle}</span>
        </Link>
      ) : (
        <span />
      )}
      {newer ? (
        <Link
          to="/newsletter/$slug"
          params={{ slug: newer.slug }}
          rel="next"
          className="bg-key text-primary flex flex-col gap-y-1 rounded-2xl px-5 py-4 shadow-[inset_0_1px_0_var(--key-highlight),0_4px_0_var(--color-skirt)] sm:items-end sm:text-right"
        >
          <span className="text-secondary text-sm font-bold">Next issue</span>
          <span className="font-bold">{newer.shortTitle}</span>
        </Link>
      ) : null}
    </nav>
  );
}
