import { Link } from "@tanstack/react-router";

interface TagBadgeProps {
  tag: string;
}

export function TagBadge({ tag }: TagBadgeProps) {
  return (
    <Link
      to="/blog/tag/$tag"
      params={{ tag }}
      className="inline-block rounded-full border border-slate-200 px-3 py-0.5 text-xs font-medium text-slate-600 transition-colors hover:border-slate-400 hover:text-slate-900 dark:border-slate-700 dark:text-slate-400 dark:hover:border-slate-500 dark:hover:text-slate-200"
    >
      {tag}
    </Link>
  );
}
