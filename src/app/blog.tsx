import { createFileRoute, Outlet } from "@tanstack/react-router";
import { HeadNav } from "components/HomePage";

export const Route = createFileRoute("/blog")({
  component: BlogLayout,
});

function BlogLayout() {
  return (
    <div className="grid h-full grid-rows-[3rem_1fr] overflow-y-auto">
      <HeadNav />
      <main className="min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
