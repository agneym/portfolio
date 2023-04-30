import { Anchor } from "components/shared";
import LogoSvg from "images/logo.svg";
import Link from "next/link";

export const HeadNav = () => {
  return (
    <nav className="flex gap-x-4 items-center justify-center md:justify-between pt-4 text-slate-600 dark:text-slate-400 px-8">
      <Link href="/" className="mr-auto">
        <LogoSvg
          width={40}
          className="text-slate-900 dark:text-slate-100"
          title="Home"
        />
      </Link>
      <div className="inline-flex gap-x-8">
        <Anchor href="/about">About</Anchor>
        <Anchor
          as="a"
          href="https://github.com/agneym?tab=repositories"
          target="_blank"
        >
          Projects
        </Anchor>
        <Anchor href="https://blog.agney.dev">Blog</Anchor>
      </div>
    </nav>
  );
};
