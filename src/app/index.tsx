import { createFileRoute } from "@tanstack/react-router";
import { HeadNav, KeyboardHero, LatestPosts } from "components/HomePage";
import { SkipNavContent } from "components/uikit/SkipNav";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="flex min-h-full flex-col">
      <HeadNav minimal />
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center gap-x-16 gap-y-14 px-4 pt-6 pb-16 sm:px-8 xl:flex-row xl:items-center xl:justify-between xl:pt-0 xl:pb-24">
        <SkipNavContent />
        <KeyboardHero />
        <div className="w-full max-w-xl xl:max-w-sm">
          <LatestPosts />
        </div>
      </main>
    </div>
  );
}
