import * as Popover from "@radix-ui/react-popover";
import { Menu } from "lucide-react";
import type { ReactNode } from "react";

interface NavbarPopoverProps {
  children: ReactNode;
}

export function NavbarPopover({ children }: NavbarPopoverProps) {
  return (
    <Popover.Root>
      <Popover.Trigger
        className="keycap keycap-mod size-10 [--travel:3px] md:hidden"
        aria-label="Menu"
      >
        <Menu aria-hidden className="size-5" />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          sideOffset={14}
          align="end"
          collisionPadding={16}
          className="z-40 data-[state=open]:animate-[sheet-in_200ms_var(--ease-out-expo)] motion-reduce:animate-none"
        >
          <div className="bg-plate-deep flex w-[min(18rem,calc(100vw-2rem))] flex-col gap-y-3 rounded-[var(--radius-plate)] p-4 shadow-[0_4px_0_var(--color-skirt),0_20px_40px_-12px_var(--key-cast)] [&>*]:w-full">
            {children}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
