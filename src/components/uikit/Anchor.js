import clsx from "clsx";
import Link from "next/link";

export const Anchor = ({ className, as: As = Link, ...rest }) => {
  return (
    <As
      className={clsx(
        "relative before:absolute before:block before:w-full before:h-0.5 before:-bottom-0.5 before:left-0 before:bg-current before:scale-0 before:transition-transform before:duration-300 before:ease-in-out hover:before:scale-100",
        className
      )}
      {...rest}
    />
  );
};
