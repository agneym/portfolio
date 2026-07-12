import type { ComponentProps } from "react";

interface SpeedSelectProps extends Omit<
  ComponentProps<"select">,
  "onChange" | "value"
> {}

export function SpeedSelect(props: SpeedSelectProps) {
  return (
    <select
      className="text-primary cursor-pointer border-none bg-transparent text-xs outline-none"
      {...props}
    >
      <option value={1200}>Slow</option>
      <option value={800}>Normal</option>
      <option value={300}>Fast</option>
    </select>
  );
}
