import { NavLink } from "components/uikit/NavLink";
import { Navbar } from "components/uikit/Navbar";
import { SkipNavLink } from "components/uikit/SkipNav";
import { NAV_SHORTCUTS } from "components/shared/shortcuts";
import { Link } from "@tanstack/react-router";
import LogoSvg from "images/logo.svg?react";

interface HeadNavProps {
  /** Home renders its nav on the keyboard itself; the header stays quiet. */
  minimal?: boolean;
}

export const HeadNav = ({ minimal = false }: HeadNavProps) => {
  return (
    <>
      <SkipNavLink />
      <Navbar>
        <Navbar.Logo>
          <Link
            to="/"
            className="text-primary group -m-1 inline-flex items-center gap-x-2 rounded-lg p-1"
            aria-label="Agney Menon, home"
          >
            <LogoSvg
              width={38}
              aria-hidden
              className="-rotate-6 transition-transform duration-300 ease-[var(--ease-clack)] group-hover:rotate-3 group-active:scale-90"
            />
          </Link>
        </Navbar.Logo>
        {minimal ? null : (
          <Navbar.Right>
            {NAV_SHORTCUTS.filter((item) => item.key !== "h").map((item) => (
              <NavLink
                key={item.key}
                href={item.href}
                legend={item.key}
                {...(item.href.startsWith("http") ? { target: "_blank" } : {})}
              >
                {item.label}
              </NavLink>
            ))}
          </Navbar.Right>
        )}
      </Navbar>
    </>
  );
};
