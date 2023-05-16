import { Header, SubscribeNewsletter, PostList } from "components/BlogHome";

function BlogHome() {
  return (
    <div className="min-h-full">
      <header className="py-24">
        <div className="flex items-center flex-col gap-y-16 justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Header />
          <SubscribeNewsletter />
        </div>
      </header>
      <main className="px-8 max-w-4xl mx-auto pb-24">
        <PostList />
      </main>
    </div>
  );
}

export default BlogHome;
