"use client";

import type { ComponentProps } from "react";
import { useInputContext } from "./InputGroup";
import clsx from "clsx";

interface InputLabelProps extends ComponentProps<"label"> {
  className?: string;
}

export function InputLabel({ className, ...rest }: InputLabelProps) {
  const { inputId } = useInputContext();

  return (
    <label
      htmlFor={inputId}
      className={clsx(
        "block text-sm leading-6 font-medium text-gray-900 dark:text-gray-300",
        className,
      )}
      {...rest}
    />
  );
}
