import { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { Search, X } from "lucide-react";
import { Input } from "components/uikit/Input";

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchField({ value, onChange }: SearchFieldProps) {
  const [draft, setDraft] = useState(value);

  // Keep the field in step with the URL (back/forward, cleared filters) by
  // resetting the draft during render whenever the incoming value changes.
  const [syncedValue, setSyncedValue] = useState(value);
  if (value !== syncedValue) {
    setSyncedValue(value);
    setDraft(value);
  }

  // Read the latest callback through a ref so parent re-renders (which give
  // `onChange` a new identity) never restart the debounce timer.
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  });

  useEffect(() => {
    if (draft === value) {
      return;
    }

    const timeout = setTimeout(() => onChangeRef.current(draft), 300);
    return () => clearTimeout(timeout);
  }, [draft, value]);

  return (
    <div className="relative w-full sm:w-72">
      <Search
        aria-hidden="true"
        className="text-tertiary pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
      />
      <Input.Group hasDescription={false}>
        <Input.InputBase
          type="search"
          value={draft}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setDraft(event.target.value)
          }
          placeholder="Search title, notes, URL"
          aria-label="Search bookmarks"
          className="pr-9 pl-9 [&::-webkit-search-cancel-button]:hidden"
        />
      </Input.Group>
      {draft ? (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => {
            setDraft("");
            onChange("");
          }}
          className="text-tertiary hover:text-primary focus-visible:ring-accent absolute top-1/2 right-2.5 -translate-y-1/2 rounded p-0.5 transition-colors focus-visible:ring-2 focus-visible:outline-none"
        >
          <X className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  );
}
