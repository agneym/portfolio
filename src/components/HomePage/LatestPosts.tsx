import { Link } from "@tanstack/react-router";
import { allPosts } from "content-collections";
import { DateString } from "components/BlogHome/DateString";

export function LatestPosts({ count = 3 }: { count?: number }) {
  const posts = allPosts
    .filter((post) => post.published !== false && post.published !== "false")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count);

  return (
    <section aria-labelledby="latest-title" className="flex flex-col gap-y-5">
      <h2
        id="latest-title"
        className="text-secondary-strong text-lg font-semibold"
      >
        Latest writing
      </h2>
      <ol className="flex flex-col gap-y-1">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              to="/blog/$slug"
              params={{ slug: post.slug }}
              className="group hover:bg-key -mx-3 flex flex-col gap-y-1 rounded-xl px-3 py-3 transition-colors"
            >
              <DateString className="text-secondary-muted tabular text-sm">
                {post.date}
              </DateString>
              <span className="text-primary text-lg leading-snug font-bold text-pretty">
                <span className="marker">{post.title}</span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
      <Link
        to="/blog"
        className="keycap keycap-mod self-start px-4 py-2.5 text-sm font-bold [--travel:3px]"
      >
        All posts
      </Link>
    </section>
  );
}
