"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const NavLink = ({ className, exact, href, as: As = Link, ...rest }) => {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <As
      className={clsx(
        "relative before:absolute before:block before:w-full before:h-0.5 before:-bottom-0.5 before:left-0 before:bg-current before:scale-0 before:transition-transform before:duration-300 before:ease-in-out hover:before:scale-100",
        isActive && "before:scale-100 text-gray-900 dark:text-gray-300",
        className,
      )}
      href={href}
      {...rest}
    />
  );
};
