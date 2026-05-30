import { getFormattedDate } from "./getFormattedDate";

interface DateStringProps {
  children: string;
  className?: string;
}

export function DateString({ children, className }: DateStringProps) {
  return (
    <time dateTime={children} className={className} suppressHydrationWarning>
      <span className="font-semibold" suppressHydrationWarning>
        {getFormattedDate(children)}
      </span>
    </time>
  );
}
