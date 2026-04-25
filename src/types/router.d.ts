import "@tanstack/react-router";

declare module "@tanstack/react-router" {
  interface FileRoutesByPath {
    "/": {
      preLoaderRoute: (typeof import("../app/index"))["Route"];
      parentRoute: (typeof import("../app/__root"))["Route"];
    };
    "/blog": {
      preLoaderRoute: (typeof import("../app/blog"))["Route"];
      parentRoute: (typeof import("../app/__root"))["Route"];
    };
    "/blog/": {
      preLoaderRoute: (typeof import("../app/blog/index"))["Route"];
      parentRoute: (typeof import("../app/blog"))["Route"];
    };
    "/blog/$slug": {
      preLoaderRoute: (typeof import("../app/blog/$slug"))["Route"];
      parentRoute: (typeof import("../app/blog"))["Route"];
    };
    "/jem": {
      preLoaderRoute: (typeof import("../app/jem"))["Route"];
      parentRoute: (typeof import("../app/__root"))["Route"];
    };
  }
}

export {};
