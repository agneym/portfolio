import clsx from "clsx";
import { ShortcutKey } from "components/shared/ShortcutKey";
import { ThemeButton } from "components/shared/ThemeButton";
import type { ReactNode } from "react";
import { NavbarPopover } from "./NavbarPopover";

interface NavbarLogoProps {
  children: ReactNode;
}

function NavbarLogo({ children }: NavbarLogoProps) {
  return children;
}

interface NavbarRightProps {
  children?: ReactNode;
}

function NavbarRight({ children }: NavbarRightProps) {
  return (
    <div className="inline-flex items-center gap-x-3">
      {children ? (
        <div className="hidden items-center gap-x-2.5 md:inline-flex">
          {children}
        </div>
      ) : null}
      <span
        aria-hidden
        className={clsx(
          "bg-muted mx-1 hidden h-6 w-px",
          children && "md:inline-block",
        )}
      />
      <ShortcutKey />
      <ThemeButton />
      {children ? <NavbarPopover>{children}</NavbarPopover> : null}
    </div>
  );
}

interface NavbarProps {
  className?: string;
  children: ReactNode;
}

export function Navbar({ className, children }: NavbarProps) {
  return (
    <nav
      aria-label="Main"
      className={clsx(
        "bg-surface/85 text-primary sticky top-0 z-30 flex items-center justify-between gap-x-4 px-4 py-3 backdrop-blur-md backdrop-saturate-150 md:px-8",
        className,
      )}
    >
      {children}
    </nav>
  );
}

Navbar.Logo = NavbarLogo;
Navbar.Right = NavbarRight;
