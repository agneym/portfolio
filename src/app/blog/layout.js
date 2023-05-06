import { HeadNav } from "components/HomePage";

function BlogLayout({ children }) {
  return (
    <div className="h-full grid grid-rows-[3rem_1fr]">
      <HeadNav />
      {children}
    </div>
  );
}

export default BlogLayout;
