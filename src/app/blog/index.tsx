import { createFileRoute } from "@tanstack/react-router";
import { SkipNavContent } from "components/uikit/SkipNav";
import { PostList } from "components/BlogHome/PostList";
import { Header } from "components/BlogHome/Header";
import { SubscribeNewsletter } from "components/BlogHome/SubscribeNewsletter";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [{ title: "Blog | Agney" }],
  }),
  component: BlogHome,
});

function BlogHome() {
  return (
    <div className="min-h-full">
      <SkipNavContent />
      <header className="mx-auto grid max-w-6xl gap-x-12 gap-y-10 px-4 pt-14 pb-16 sm:px-8 sm:pt-20 lg:grid-cols-[1fr_minmax(0,36rem)] lg:items-end">
        <Header />
        <SubscribeNewsletter />
      </header>
      <div className="mx-auto max-w-6xl px-4 pb-24 sm:px-8">
        <PostList />
      </div>
    </div>
  );
}
