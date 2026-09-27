import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";
import { toSearchParams, totalPages, type ListParams } from "webmarks/api";

interface PaginationProps {
  params: ListParams;
  total: number;
}

const buttonClass =
  "border-muted text-secondary hover:border-tertiary hover:text-primary focus-visible:ring-accent inline-flex items-center gap-x-1 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none";

export function Pagination({ params, total }: PaginationProps) {
  const pages = totalPages(total);
  const page = Math.min(params.page, pages);

  if (pages <= 1) {
    return null;
  }

  const pad = (value: number) => String(value).padStart(2, "0");

  return (
    <nav
      aria-label="Pagination"
      className="border-muted mt-10 flex items-center justify-between border-t pt-6"
    >
      <p className="text-tertiary font-mono text-[0.6875rem] tracking-widest uppercase">
        Page {pad(page)} / {pad(pages)}
      </p>
      <div className="flex items-center gap-x-2">
        {page > 1 ? (
          <Link
            to="/webmarks"
            search={toSearchParams({ ...params, page: page - 1 })}
            className={buttonClass}
          >
            <ChevronLeft aria-hidden="true" className="h-3.5 w-3.5" />
            Previous
          </Link>
        ) : (
          <span
            aria-disabled="true"
            className={clsx(buttonClass, "pointer-events-none opacity-40")}
          >
            <ChevronLeft aria-hidden="true" className="h-3.5 w-3.5" />
            Previous
          </span>
        )}
        {page < pages ? (
          <Link
            to="/webmarks"
            search={toSearchParams({ ...params, page: page + 1 })}
            className={buttonClass}
          >
            Next
            <ChevronRight aria-hidden="true" className="h-3.5 w-3.5" />
          </Link>
        ) : (
          <span
            aria-disabled="true"
            className={clsx(buttonClass, "pointer-events-none opacity-40")}
          >
            Next
            <ChevronRight aria-hidden="true" className="h-3.5 w-3.5" />
          </span>
        )}
      </div>
    </nav>
  );
}
