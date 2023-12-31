import clsx from "clsx";

export function LoadingRow({ colCount = 1 }) {
  return (
    <div
      style={{ "--col-count": colCount }}
      className={clsx(
        "h-4 bg-slate-300 dark:bg-slate-700 rounded",
        "col-[span_var(--col-count)_/_span_var(--col-count)]",
      )}
    />
  );
}
