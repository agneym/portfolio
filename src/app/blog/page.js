import { Header, SubscribeNewsletter, PostList } from "components/BlogHome";
import { SkipNavContent } from "components/uikit/SkipNav";

export const metadata = {
  title: "Blog | Agney",
};

function BlogHome() {
  return (
    <div className="min-h-full">
      <SkipNavContent />
      <header className="py-24">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-y-16 px-4 sm:px-6 lg:px-8">
          <Header />
          <SubscribeNewsletter />
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-8 pb-20">
        <PostList />
      </main>
    </div>
  );
}

export default BlogHome;
