import IntroSection from "@/components/IntroSection.mdx";
import ProjectsList from "@/components/ProjectsList";
import Description from "@/components/Description";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <IntroSection />
      <Description />
      <ProjectsList />
      <Footer />
    </>
  );
}
