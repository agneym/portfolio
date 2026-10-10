/// <reference types="vite/client" />
import {
  Outlet,
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import "@fontsource-variable/unbounded";
import "@fontsource-variable/atkinson-hyperlegible-next";
import "@fontsource-variable/atkinson-hyperlegible-next/wght-italic.css";
import "@fontsource-variable/martian-mono/standard.css";
import appCss from "./global.css?url";
import unboundedLatin from "@fontsource-variable/unbounded/files/unbounded-latin-wght-normal.woff2?url";
import { Providers } from "./providers";
import type { QueryClient } from "@tanstack/react-query";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      { title: "Portfolio | Agney" },
      { property: "og:title", content: "Portfolio | Agney" },
      {
        name: "description",
        content:
          "Frontend engineer Agney Menon builds fast, accessible web apps. Explore projects and writing on React and TypeScript.",
      },
      {
        property: "og:description",
        content:
          "Frontend engineer Agney Menon builds fast, accessible web apps. Explore projects and writing on React and TypeScript.",
      },
      { property: "og:image", content: "https://agney.dev/og.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "keywords",
        content: "Frontend Developerd, Engineer, Portfolio",
      },
      { name: "creator", content: "Agney" },
      { name: "robots", content: "index, follow" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: "/icon.png" },
      // The display face sets the first viewport; fetch it with the CSS.
      {
        rel: "preload",
        href: unboundedLatin,
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="bg-surface text-primary h-full antialiased">
        <Providers>
          <Outlet />
        </Providers>
        <Scripts />
      </body>
    </html>
  );
}
