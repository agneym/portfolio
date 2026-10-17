import { createFileRoute } from "@tanstack/react-router";
import { PostList } from "components/BlogHome/PostList";
import { getPublishedPosts } from "components/BlogHome/getPublishedPosts";
import { Lemon } from "components/shared/Lemon";
import { PageHero } from "components/shared/PageHero";
import { PageShell } from "components/shared/PageShell";
import { SectionBar } from "components/shared/SectionBar";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [{ title: "Blog | Agney" }],
  }),
  component: BlogHome,
});

function BlogHome() {
  return (
    <PageShell>
      <PageHero
        title="Blog"
        tagline={
          <>
            Welcome to Agney&apos;s <Lemon>Digital Garden</Lemon>
          </>
        }
        meta={`${getPublishedPosts().length} posts`}
        subscribeTag="blog"
      />
      <SectionBar heading="Latest Posts" />
      <PostList />
    </PageShell>
  );
}
