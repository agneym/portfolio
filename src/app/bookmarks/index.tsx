import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/bookmarks/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/bookmarks/"!</div>;
}
