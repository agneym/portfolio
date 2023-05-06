import { Header, SubscribeNewsletter } from "components/BlogHome";

function BlogHome() {
  return (
    <div className="h-full">
      <div className="py-32">
        <div className="flex items-center flex-col justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 gap-y-5">
          <Header />
          <SubscribeNewsletter />
        </div>
      </div>
    </div>
  );
}

export default BlogHome;
