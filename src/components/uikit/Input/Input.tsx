"use client";

import type { ComponentProps } from "react";
import { useInputContext } from "./InputGroup";
import { clsx } from "clsx";

interface InputProps extends ComponentProps<"input"> {
  className?: string;
}

export function Input({ className, ...rest }: InputProps) {
  const { inputId, hasDescription, descriptionId } = useInputContext();

  return (
    <div>
      <input
        id={inputId}
        className={clsx(
          "block w-full rounded-md border-0 py-2 text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 focus:ring-inset sm:text-sm sm:leading-6 dark:bg-slate-800 dark:text-gray-300 dark:ring-gray-600 dark:placeholder:text-gray-500 dark:focus:ring-indigo-500",
          className,
        )}
        aria-describedby={hasDescription ? descriptionId : undefined}
        {...rest}
      />
    </div>
  );
}
