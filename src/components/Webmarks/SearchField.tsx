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
    <div className="relative w-full sm:w-80">
      <Search
        aria-hidden="true"
        className="text-secondary pointer-events-none absolute top-1/2 left-3.5 z-10 h-4 w-4 -translate-y-1/2"
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
          aria-keyshortcuts="/"
          data-shortcut-search=""
          className="pr-10 pl-10 [&::-webkit-search-cancel-button]:hidden"
        />
      </Input.Group>
      {draft ? null : (
        <kbd
          aria-hidden
          className="keycap keycap-plain pointer-events-none absolute top-1/2 right-2.5 hidden h-6 min-w-6 -translate-y-1/2 px-1.5 font-mono text-xs [--radius-key:0.375rem] [--travel:2px] pointer-fine:inline-flex"
        >
          /
        </kbd>
      )}
      {draft ? (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => {
            setDraft("");
            onChange("");
          }}
          className="text-secondary hover:text-primary absolute top-1/2 right-2.5 -translate-y-1/2 rounded p-1 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  );
}
