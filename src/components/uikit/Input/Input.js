"use client";

import { useInputContext } from "./InputGroup";
import { clsx } from "clsx";

export function Input({ className, ...rest }) {
  const { inputId, hasDescription, descriptionId } = useInputContext();

  return (
    <div>
      <input
        id={inputId}
        className={clsx(
          "block w-full rounded-md dark:bg-slate-800 border-0 py-2 text-gray-900 dark:text-gray-300 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 placeholder:dark:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 focus:dark:ring-indigo-500 sm:text-sm sm:leading-6",
          className,
        )}
        aria-describedby={hasDescription ? descriptionId : undefined}
        {...rest}
      />
    </div>
  );
}
