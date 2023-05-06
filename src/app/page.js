import { HeadNav, Intro, Footer } from "components/HomePage";

export default function Home() {
  return (
    <div className="h-full grid grid-rows-[3rem_1fr_6rem]">
      <HeadNav />
      <Intro />
      <Footer />
    </div>
  );
}
