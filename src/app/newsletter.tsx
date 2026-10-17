import { createFileRoute, Outlet } from "@tanstack/react-router";
import { HeadNav } from "components/HomePage";

export const Route = createFileRoute("/newsletter")({
  component: NewsletterLayout,
});

function NewsletterLayout() {
  return (
    <div
      data-scroll-restoration-id="newsletter-scroll"
      className="grid h-full grid-rows-[3rem_1fr] overflow-y-auto"
    >
      <HeadNav />
      <main className="min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
