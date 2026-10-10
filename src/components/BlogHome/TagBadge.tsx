import { Link } from "@tanstack/react-router";

interface TagBadgeProps {
  tag: string;
}

/** A tag is a small blank keycap with the tag as its legend. */
export function TagBadge({ tag }: TagBadgeProps) {
  return (
    <Link
      to="/blog/tag/$tag"
      params={{ tag }}
      className="keycap keycap-plain px-2.5 pt-1 pb-1.5 text-xs font-bold [--radius-key:0.5rem] [--travel:2px]"
    >
      {tag}
    </Link>
  );
}
