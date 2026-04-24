import { createFileRoute } from "@tanstack/react-router";
import { HeadNav, Intro, Footer } from "components/HomePage";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="grid h-full grid-rows-[3rem_1fr_6rem]">
      <HeadNav />
      <Intro />
      <Footer />
    </div>
  );
}
