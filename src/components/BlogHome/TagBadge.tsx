import { Link } from "@tanstack/react-router";

interface TagBadgeProps {
  tag: string;
}

export function TagBadge({ tag }: TagBadgeProps) {
  return (
    <Link
      to="/blog/tag/$tag"
      params={{ tag }}
      className="border-muted text-secondary hover:border-tertiary hover:text-primary inline-block rounded-full border px-3 py-0.5 text-xs font-medium transition-colors"
    >
      {tag}
    </Link>
  );
}
