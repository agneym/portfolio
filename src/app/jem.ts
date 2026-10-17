import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/jem")({
  beforeLoad: () => {
    throw redirect({ to: "/newsletter", statusCode: 301 });
  },
});
