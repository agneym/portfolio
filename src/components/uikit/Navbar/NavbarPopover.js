"use client";

import * as Popover from "@radix-ui/react-popover";
import HamburgerSvg from "images/hamburger.svg";

export function NavbarPopover({ children }) {
  return (
    <Popover.Root>
      <Popover.Trigger className="inline-flex md:hidden" title="Menu">
        <HamburgerSvg width={20} height={20} />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content sideOffset={24}>
          <div className="w-[var(--radix-popover-content-available-width)] flex flex-col gap-y-6 bg-slate-200/40 dark:bg-slate-900/40 px-4 py-2 shadow-sm backdrop-blur-sm">
            {children}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
