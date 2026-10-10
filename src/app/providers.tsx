import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { KeyboardShortcuts } from "components/shared/KeyboardShortcuts";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider attribute="class">
      {children}
      <KeyboardShortcuts />
    </ThemeProvider>
  );
}
