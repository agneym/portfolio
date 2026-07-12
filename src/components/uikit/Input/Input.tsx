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
          "block w-full rounded-md border-0 py-2 text-primary shadow-xs ring-1 ring-muted ring-inset placeholder:text-tertiary focus:ring-2 focus:ring-accent focus:ring-inset sm:text-sm sm:leading-6 bg-surface",
          className,
        )}
        aria-describedby={hasDescription ? descriptionId : undefined}
        {...rest}
      />
    </div>
  );
}
