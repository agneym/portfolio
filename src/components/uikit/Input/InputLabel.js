"use client";

import { useInputContext } from "./InputGroup";
import clsx from "clsx";

export function InputLabel({ className, ...rest }) {
  const { inputId } = useInputContext();

  return (
    <label
      htmlFor={inputId}
      className={clsx(
        "block text-sm font-medium leading-6 text-gray-900 dark:text-gray-300",
        className,
      )}
      {...rest}
    />
  );
}
