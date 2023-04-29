import { Footer } from "components/Footer";
import { HeadNav } from "components/HeadNav";
import { Intro } from "components/Intro";

export default function Home() {
  return (
    <div className="h-full grid grid-rows-[3rem_1fr_6rem] bg-gray-100 selection:bg-gray-200 dark:bg-slate-800 dark:selection:bg-slate-700">
      <HeadNav />
      <Intro />
      <Footer />
    </div>
  );
}
