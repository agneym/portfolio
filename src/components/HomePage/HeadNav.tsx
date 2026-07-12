import { NavLink } from "components/uikit/NavLink";
import { Navbar } from "components/uikit/Navbar";
import { SkipNavLink } from "components/uikit/SkipNav";
import LogoSvg from "images/logo.svg?react";

export const HeadNav = () => {
  return (
    <>
      <SkipNavLink className="text-surface focus:data-reach-skip-link:bg-primary" />
      <Navbar>
        <Navbar.Logo>
          <NavLink
            href="/"
            className="mr-auto -rotate-6 transition-transform before:scale-0! hover:rotate-0 hover:before:scale-0!"
          >
            <LogoSvg width={40} className="text-primary" title="Home" />
          </NavLink>
        </Navbar.Logo>
        <Navbar.Right>
          <NavLink
            href="https://github.com/agneym?tab=repositories"
            target="_blank"
          >
            Projects
          </NavLink>
          <NavLink href="/webmarks">Webmarks</NavLink>
          <NavLink href="/blog">Blog</NavLink>
          <NavLink href="https://buttondown.email/agney" target="_blank">
            Newsletter
          </NavLink>
        </Navbar.Right>
      </Navbar>
    </>
  );
};
