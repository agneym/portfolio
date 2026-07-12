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
      <header className="pt-24 pb-28">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-y-16 px-4 sm:px-6 lg:px-8">
          <Header />
          <div className="w-full max-w-3xl px-4">
            <SubscribeNewsletter />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-8 pb-20">
        <PostList />
      </main>
    </div>
  );
}
