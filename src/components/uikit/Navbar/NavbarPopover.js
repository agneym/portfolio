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
          <div className="flex w-[var(--radix-popover-content-available-width)] flex-col gap-y-6 bg-slate-200/40 px-4 py-2 shadow-xs backdrop-blur-xs dark:bg-slate-900/40">
            {children}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
