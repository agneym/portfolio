import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import "@fontsource-variable/work-sans";
import appCss from "./global.css?url";
import { Providers } from "./providers";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      { title: "Portfolio | Agney" },
      {
        name: "description",
        content: "A portfolio for Web Developer - Agney Menon",
      },
      {
        name: "keywords",
        content: "Frontend Developer, Developer, Engineer, Portfolio",
      },
      { name: "creator", content: "Agney" },
      { name: "robots", content: "index, follow" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: "/icon.png" },
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
      <body className="h-full bg-slate-50 selection:bg-indigo-100 dark:bg-slate-800 dark:selection:bg-indigo-600">
        <Providers>
          <Outlet />
        </Providers>
        <Scripts />
      </body>
    </html>
  );
}
