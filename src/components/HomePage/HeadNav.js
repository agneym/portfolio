import { NavLink } from "components/uikit/NavLink";
import { Navbar } from "components/uikit/Navbar";
import { SkipNavLink } from "components/uikit/SkipNav";
import LogoSvg from "images/logo.svg";
import Link from "next/link";

export const HeadNav = () => {
  return (
    <>
      <SkipNavLink className="text-gray-50 dark:text-gray-700 focus:data-reach-skip-link:bg-slate-600 dark:focus:data-reach-skip-link:bg-slate-200" />
      <Navbar>
        <Navbar.Logo>
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
        </Navbar.Logo>
        <Navbar.Right>
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
        </Navbar.Right>
      </Navbar>
    </>
  );
};
