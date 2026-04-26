import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/webmarks/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/webmarks/"!</div>;
}
