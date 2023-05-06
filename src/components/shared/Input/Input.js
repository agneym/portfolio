import { useInputContext } from "./InputGroup";
import { clsx } from "clsx";

export function Input({ className, ...rest }) {
  const { inputId, hasDescription, descriptionId } = useInputContext();

  return (
    <div>
      <input
        id={inputId}
        className={clsx(
          "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6",
          className
        )}
        aria-describedby={hasDescription ? descriptionId : undefined}
        {...rest}
      />
    </div>
  );
}
