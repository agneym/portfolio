import { SORT_LABELS, SORT_ORDERS, type SortOrder } from "webmarks/api";

interface SortSelectProps {
  value: SortOrder;
  onChange: (sort: SortOrder) => void;
}

export function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <label className="text-tertiary flex shrink-0 items-center gap-x-2 text-xs">
      <span className="hidden font-mono tracking-widest uppercase sm:inline">
        Sort
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as SortOrder)}
        aria-label="Sort bookmarks"
        className="border-muted text-primary bg-surface focus:ring-accent rounded-md border py-2 pr-8 pl-3 text-sm ring-inset focus:ring-2"
      >
        {SORT_ORDERS.map((order) => (
          <option key={order} value={order}>
            {SORT_LABELS[order]}
          </option>
        ))}
      </select>
    </label>
  );
}
