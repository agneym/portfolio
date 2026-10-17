import { PostListItem } from "./PostListItem";
import { getPublishedPosts } from "./getPublishedPosts";

export function PostList() {
  const posts = getPublishedPosts();

  // Group by year: the year is a wide key that rides along as you scroll.
  const years = new Map<number, typeof posts>();
  for (const post of posts) {
    const year = new Date(post.date).getUTCFullYear();
    years.set(year, [...(years.get(year) ?? []), post]);
  }

  return (
    <>
      <div className="mt-8 flex flex-col gap-y-12">
        {[...years].map(([year, yearPosts]) => (
          <section
            key={year}
            aria-labelledby={`year-${year}`}
            className="grid gap-x-10 md:grid-cols-[8rem_1fr]"
          >
            <div className="md:sticky md:top-36 md:self-start">
              <h3
                id={`year-${year}`}
                className="keycap keycap-mod tabular px-4 py-2 text-lg font-semibold"
              >
                {year}
              </h3>
            </div>
            <div className="divide-muted flex flex-col divide-y">
              {yearPosts.map((post) => (
                <PostListItem
                  key={post.slug}
                  meta={{
                    title: post.title,
                    date: post.date,
                    ...(post.tags != null ? { tags: post.tags } : {}),
                  }}
                  slug={post.slug}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
