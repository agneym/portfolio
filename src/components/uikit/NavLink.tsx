import clsx from "clsx";
import { Link, useRouterState } from "@tanstack/react-router";
import type { ComponentProps, ReactNode } from "react";

interface NavLinkProps {
  className?: string;
  exact?: boolean;
  href: string;
  children: ReactNode;
  /** Shortcut letter printed as the keycap's top-left legend. */
  legend?: string | undefined;
}

/**
 * A navigation keycap. The current page's key stays pressed into the plate.
 */
export function NavLink({
  className,
  exact,
  href,
  children,
  legend,
  target,
  rel,
}: NavLinkProps & Pick<ComponentProps<"a">, "target" | "rel">) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isExternal = href.startsWith("http") || href.startsWith("mailto:");
  const isActive =
    !isExternal && (exact ? pathname === href : pathname.startsWith(href));
  const classes = clsx(
    "keycap keycap-plain relative h-10 justify-start px-3.5 pt-3 pb-1.5 text-sm font-bold [--travel:3px]",
    legend && "pl-3.5",
    className,
  );
  const content = (
    <>
      {legend ? (
        <span
          aria-hidden
          className="absolute top-1 left-2 font-mono text-[0.625rem] leading-none uppercase opacity-70"
        >
          {legend}
        </span>
      ) : null}
      <span className="leading-none">{children}</span>
    </>
  );

  if (isExternal) {
    return (
      <a
        href={href}
        className={classes}
        target={target}
        rel={rel ?? (target === "_blank" ? "noopener noreferrer" : undefined)}
        aria-keyshortcuts={legend}
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      to={href}
      className={classes}
      aria-current={isActive ? "page" : undefined}
      aria-keyshortcuts={legend}
    >
      {content}
    </Link>
  );
}
