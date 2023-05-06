import { useInputContext } from "./InputGroup";

export function InputLabel() {
  const { inputId } = useInputContext();

  return (
    <label
      htmlFor={inputId}
      className="block text-sm font-medium leading-6 text-gray-900"
    >
      Email
    </label>
  );
}
