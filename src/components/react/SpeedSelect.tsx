import type { ComponentProps } from "react";

type SpeedSelectProps = Omit<ComponentProps<"select">, "onChange" | "value"> & {
  value: number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

export default function SpeedSelect(props: SpeedSelectProps) {
  return (
    <select
      className="cursor-pointer border-none bg-transparent text-xs text-slate-900 outline-none dark:text-slate-100"
      {...props}
    >
      <option value={1200}>Slow</option>
      <option value={800}>Normal</option>
      <option value={300}>Fast</option>
    </select>
  );
}
