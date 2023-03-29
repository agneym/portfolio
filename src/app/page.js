import { Footer } from "components/Footer";
import { HeadNav } from "components/HeadNav";
import { Intro } from "components/Intro";

export default function Home() {
  return (
    <div className="h-full grid grid-rows-[3rem_1fr_3rem]">
      <HeadNav />
      <Intro />
      <Footer />
    </div>
  );
}
