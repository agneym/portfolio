import { getFormattedDate } from "./getFormattedDate";

interface DateStringProps {
  children: string;
  className?: string;
}

export function DateString({ children, className }: DateStringProps) {
  return (
    <time dateTime={children} className={className}>
      <span className="font-semibold">{getFormattedDate(children)}</span>
    </time>
  );
}
