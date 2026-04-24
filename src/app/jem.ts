import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/jem")({
  loader: () => {
    throw new Response(null, {
      status: 301,
      headers: {
        Location: "https://buttondown.email/agney",
      },
    });
  },
  component: () => null,
});
