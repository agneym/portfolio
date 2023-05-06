import { ThemeButton } from "components/shared";
import { NavLink } from "components/uikit";
import LogoSvg from "images/logo.svg";
import Link from "next/link";

export const HeadNav = () => {
  return (
    <nav className="sticky flex gap-x-4 items-center justify-center md:justify-between pt-4 text-gray-800 dark:text-gray-400 px-8 backdrop-blur-sm opacity-80">
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
        <NavLink href="/about">About</NavLink>
        <NavLink
          as="a"
          href="https://github.com/agneym?tab=repositories"
          target="_blank"
        >
          Projects
        </NavLink>
        <NavLink as={Link} href="/blog">
          Blog
        </NavLink>
        <NavLink as="a" href="https://buttondown.email/agney" target="_blank">
          Newsletter
        </NavLink>
        <ThemeButton />
      </div>
    </nav>
  );
};
