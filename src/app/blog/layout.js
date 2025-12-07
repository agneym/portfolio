import { HeadNav } from "components/HomePage";

function BlogLayout({ children }) {
  return (
    <div className="grid h-full grid-rows-[3rem_1fr] overflow-y-auto">
      <HeadNav />
      {children}
    </div>
  );
}

export default BlogLayout;
