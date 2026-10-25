import { defineConfig, type RsbuildPlugin } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginSvgr } from "@rsbuild/plugin-svgr";
import { tanstackStart } from "@tanstack/react-start/plugin/rsbuild";
import { createBuilder } from "@content-collections/core";
import { configureLogging } from "@content-collections/integrations";
import path from "path";

/** Content Collections ships no Rsbuild plugin, so drive its builder directly. */
function pluginContentCollections(): RsbuildPlugin {
  return {
    name: "content-collections",
    setup(api) {
      let unsubscribe: (() => Promise<void>) | undefined;
      const build = async () => {
        const builder = await createBuilder(
          path.resolve(api.context.rootPath, "content-collections.ts"),
        );
        configureLogging(builder);
        await builder.build();
        return builder;
      };
      api.onBeforeBuild(async ({ isFirstCompile }) => {
        if (isFirstCompile) await build();
      });
      api.onBeforeStartDevServer(async () => {
        const subscription = await (await build()).watch();
        unsubscribe = () => subscription.unsubscribe();
      });
      api.onCloseDevServer(async () => {
        await unsubscribe?.();
      });
    },
  };
}

export default defineConfig({
  resolve: {
    alias: {
      components: path.resolve(import.meta.dirname, "src/components"),
      images: path.resolve(import.meta.dirname, "src/images"),
      webmarks: path.resolve(import.meta.dirname, "src/webmarks"),
      "content-collections": path.resolve(
        import.meta.dirname,
        ".content-collections/generated",
      ),
    },
  },
  server: {
    port: 3000,
  },
  tools: {
    rspack: {
      // Rsbuild's built-in `?raw` only covers known asset types, not Markdown.
      module: {
        rules: [{ test: /\.md$/, resourceQuery: /raw/, type: "asset/source" }],
      },
    },
  },
  plugins: [
    pluginContentCollections(),
    pluginReact(),
    pluginSvgr(),
    tanstackStart({
      srcDirectory: "src",
      router: {
        routesDirectory: "app",
        routeFileIgnorePattern: "(client\\.tsx|server\\.ts|providers\\.tsx)$",
      },
    }),
  ],
});
