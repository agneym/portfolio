import { HeadNav, Intro, Footer } from "components/HomePage";

export default function Home() {
  return (
    <div className="grid h-full grid-rows-[3rem_1fr_6rem]">
      <HeadNav />
      <Intro />
      <Footer />
    </div>
  );
}
