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
        "relative before:absolute before:-bottom-0.5 before:left-0 before:block before:h-0.5 before:w-full before:scale-0 before:bg-current before:transition-transform before:duration-300 before:ease-in-out hover:before:scale-100",
        isActive && "text-gray-900 before:scale-100 dark:text-gray-300",
        className,
      )}
      href={href}
      {...rest}
    />
  );
};
