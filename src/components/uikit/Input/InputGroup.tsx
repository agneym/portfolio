"use client";

import clsx from "clsx";
import { useId, createContext, useContext, useMemo } from "react";
import type { ComponentProps, ReactNode } from "react";
import invariant from "tiny-invariant";

interface InputContextValue {
  inputId: string;
  descriptionId: string;
  hasDescription: boolean;
}

const InputContext = createContext<InputContextValue | null>(null);

export const useInputContext = (): InputContextValue => {
  const context = useContext(InputContext);
  invariant(
    context,
    "Input compound components cannot be rendered outside the Input component",
  );

  return context;
};

interface InputGroupProps extends ComponentProps<"div"> {
  className?: string;
  hasDescription: boolean;
  children: ReactNode;
}

export function InputGroup({
  className,
  hasDescription,
  children,
  ...rest
}: InputGroupProps) {
  const inputId = useId();
  const descriptionId = useId();

  const value = useMemo(
    () => ({ inputId, descriptionId, hasDescription }),
    [inputId, descriptionId, hasDescription],
  );

  return (
    <InputContext.Provider value={value}>
      <div className={clsx("flex flex-col gap-y-0.5", className)} {...rest}>
        {children}
      </div>
    </InputContext.Provider>
  );
}
