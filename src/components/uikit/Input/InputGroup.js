"use client";

import clsx from "clsx";
import { useId, createContext, useContext, useMemo } from "react";
import invariant from "tiny-invariant";

const InputContext = createContext(null);

export const useInputContext = () => {
  const context = useContext(InputContext);
  invariant(
    context,
    "Input compound components cannot be rendered outside the Input component",
  );

  return context;
};

export function InputGroup({ className, hasDescription, children, ...rest }) {
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
