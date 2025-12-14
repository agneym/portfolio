"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentPropsWithRef, ElementType } from "react";

type NavLinkProps<T extends ElementType = typeof Link> = {
  className?: string;
  exact?: boolean;
  href: string;
  as?: T;
} & Omit<ComponentPropsWithRef<T>, "as" | "href" | "className">;

export function NavLink<T extends ElementType = typeof Link>({
  className,
  exact,
  href,
  as: As = Link as unknown as T,
  ...rest
}: NavLinkProps<T>) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  const Component = As as ElementType;

  return (
    <Component
      className={clsx(
        "relative before:absolute before:-bottom-0.5 before:left-0 before:block before:h-0.5 before:w-full before:scale-0 before:bg-current before:transition-transform before:duration-300 before:ease-in-out hover:before:scale-100",
        isActive && "text-gray-900 before:scale-100 dark:text-gray-300",
        className,
      )}
      href={href}
      {...rest}
    />
  );
}
