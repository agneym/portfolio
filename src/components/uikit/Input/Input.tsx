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
          "key-well block w-full border-0 bg-key px-3.5 py-2.5 text-base text-primary placeholder:text-tertiary focus:ring-2 focus:ring-accent focus:outline-none",
          className,
        )}
        aria-describedby={hasDescription ? descriptionId : undefined}
        {...rest}
      />
    </div>
  );
}
