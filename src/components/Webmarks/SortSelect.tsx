import { SORT_LABELS, SORT_ORDERS, type SortOrder } from "webmarks/api";

interface SortSelectProps {
  value: SortOrder;
  onChange: (sort: SortOrder) => void;
}

export function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <label className="text-secondary flex shrink-0 items-center gap-x-2 text-sm font-bold">
      <span className="hidden sm:inline">Sort</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as SortOrder)}
        aria-label="Sort bookmarks"
        className="key-well text-primary focus:ring-accent border-0 py-2.5 pr-9 pl-3.5 text-base font-normal focus:ring-2"
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
