import { SkipNavLink } from "@reach/skip-nav";
import { ThemeButton } from "components/shared";
import { NavLink } from "components/uikit";
import LogoSvg from "images/logo.svg";
import Link from "next/link";

export const HeadNav = () => {
  return (
    <>
      <SkipNavLink className="text-gray-50 dark:text-gray-700 focus:data-[reach-skip-link]:bg-slate-600 focus:data-[reach-skip-link]:dark:bg-slate-200" />
      <nav className="sticky top-0 flex gap-x-4 items-center justify-center md:justify-between pt-4 pb-2 text-gray-800 dark:text-gray-400 bg-inherit px-8 backdrop-blur-sm opacity-90">
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
        <div className="gap-x-8 hidden md:inline-flex">
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
    </>
  );
};
