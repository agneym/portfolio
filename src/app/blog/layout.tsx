import { HeadNav } from "components/HomePage";
import type { ReactNode } from "react";

interface BlogLayoutProps {
  children: ReactNode;
}

function BlogLayout({ children }: BlogLayoutProps) {
  return (
    <div className="grid h-full grid-rows-[3rem_1fr] overflow-y-auto">
      <HeadNav />
      {children}
    </div>
  );
}

export default BlogLayout;
