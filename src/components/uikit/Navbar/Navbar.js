import { NavbarPopover } from "./NavbarPopover";
import clsx from "clsx";
import { ThemeButton } from "components/shared";

function NavbarLogo({ children }) {
  return children;
}

function NavbarRight({ children }) {
  return (
    <div className="inline-flex items-center gap-x-8">
      <div className="hidden items-center gap-x-8 md:inline-flex">
        {children}
      </div>
      <ThemeButton />
      <NavbarPopover>{children}</NavbarPopover>
    </div>
  );
}

export function Navbar({ className, children }) {
  return (
    <nav
      className={clsx(
        "sticky top-0 flex items-center justify-center gap-x-4 bg-inherit px-4 pt-4 pb-2 text-gray-800 opacity-90 backdrop-blur-xs md:justify-between md:px-8 dark:text-gray-400",
        className,
      )}
    >
      {children}
    </nav>
  );
}

Navbar.Logo = NavbarLogo;
Navbar.Right = NavbarRight;
