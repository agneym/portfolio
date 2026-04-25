import clsx from "clsx";
import { Link, useRouterState } from "@tanstack/react-router";
import type { ComponentProps } from "react";

interface NavLinkProps {
  className?: string;
  exact?: boolean;
  href: string;
  children: React.ReactNode;
}

export function NavLink({
  className,
  exact,
  href,
  children,
  target,
  rel,
}: NavLinkProps & Pick<ComponentProps<"a">, "target" | "rel">) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = exact ? pathname === href : pathname.startsWith(href);
  const baseClassName = clsx(
    "relative before:absolute before:-bottom-0.5 before:left-0 before:block before:h-0.5 before:w-full before:scale-0 before:bg-current before:transition-transform before:duration-300 before:ease-in-out hover:before:scale-100",
    isActive && "text-gray-900 before:scale-100 dark:text-gray-300",
    className,
  );

  if (href.startsWith("http") || href.startsWith("mailto:")) {
    return (
      <a href={href} className={baseClassName} target={target} rel={rel}>
        {children}
      </a>
    );
  }

  return (
    <Link to={href} className={baseClassName}>
      {children}
    </Link>
  );
}
