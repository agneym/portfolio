import type { ReactNode } from "react";
import { Footer } from "components/HomePage";
import { SkipNavContent } from "components/uikit/SkipNav";

interface PageShellProps {
  children: ReactNode;
}

/** The frame shared by the collection pages: container, skip-nav and footer. */
export function PageShell({ children }: PageShellProps) {
  return (
    <div className="min-h-full">
      <SkipNavContent />
      <div className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-8">
        {children}
      </div>
      <div className="pb-16">
        <Footer />
      </div>
    </div>
  );
}
