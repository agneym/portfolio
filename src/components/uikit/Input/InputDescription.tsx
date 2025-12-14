"use client";

import { useInputContext } from "./InputGroup";
import clsx from "clsx";
import invariant from "tiny-invariant";
import type { ReactNode } from "react";

interface InputDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
  className?: string;
}

export const InputDescription = ({
  children,
  className,
  ...rest
}: InputDescriptionProps) => {
  const { hasDescription, descriptionId } = useInputContext();

  invariant(
    hasDescription,
    "Set hasDescription on InputGroup to true when rendering InputDescription",
  );
  return (
    <p
      className={clsx(
        "mt-1 text-sm text-gray-600 dark:text-gray-400",
        className,
      )}
      id={descriptionId}
      {...rest}
    >
      {children}
    </p>
  );
};
