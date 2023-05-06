import { useInputContext } from "./InputGroup";
import invariant from "tiny-invariant";

export const InputDescription = ({ children }) => {
  const { hasDescription, descriptionId } = useInputContext();

  invariant(
    hasDescription,
    "Set hasDescription on InputGroup to true when rendering InputDescription"
  );
  return (
    <p className="mt-2 text-sm text-gray-500" id={descriptionId}>
      {children}
    </p>
  );
};
