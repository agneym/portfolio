"use client";

import * as Popover from "@radix-ui/react-popover";
import HamburgerSvg from "images/hamburger.svg";

export function NavbarPopover({ children }) {
  return (
    <Popover.Root>
      <Popover.Trigger className="inline-flex md:hidden">
        <HamburgerSvg width={20} height={20} />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content sideOffset={5}>{children}</Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
