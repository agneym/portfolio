import type { ReactNode } from "react";

/** Lemon-yellow highlight for the key phrase of a page tagline. */
export function Lemon({ children }: { children: ReactNode }) {
  return (
    <span className="bg-lemon text-text-on-lemon rounded-md px-1.5 font-bold">
      {children}
    </span>
  );
}
