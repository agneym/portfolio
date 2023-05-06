import { Anchor } from "components/shared";
import { ThemeButton } from "components/shared";
import LogoSvg from "images/logo.svg";
import Link from "next/link";

export const HeadNav = () => {
  return (
    <nav className="sticky flex gap-x-4 items-center justify-center md:justify-between pt-4 text-slate-600 dark:text-slate-400 px-8 backdrop-blur-sm opacity-80">
      <Link
        href="/"
        className="mr-auto -rotate-6 hover:rotate-0 transition-transform"
      >
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
        <Anchor as={Link} href="/blog">
          Blog
        </Anchor>
        <Anchor as="a" href="https://buttondown.email/agney" target="_blank">
          Newsletter
        </Anchor>
        <ThemeButton />
      </div>
    </nav>
  );
};
