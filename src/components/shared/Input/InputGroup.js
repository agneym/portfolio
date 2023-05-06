"use client";

import clsx from "clsx";
import { useId, createContext, useContext } from "react";
import invariant from "tiny-invariant";

const InputContext = createContext(null);

export const useInputContext = () => {
  const context = useContext(InputContext);
  invariant(
    context,
    "Input compound components cannot be rendered outside the Input component"
  );

  return context;
};

export function InputGroup({
  inputId: userInputId,
  className,
  children,
  ...rest
}) {
  const generatedInputId = useId();
  const inputId = userInputId ?? generatedInputId;

  return (
    <InputContext.Provider value={{ inputId }}>
      <div className={clsx("flex flex-col gap-y-2", className)} {...rest}>
        {children}
      </div>
    </InputContext.Provider>
  );
}
