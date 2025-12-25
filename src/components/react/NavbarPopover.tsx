import * as Popover from "@radix-ui/react-popover";
import clsx from "clsx";

const HamburgerIcon = () => (
  <svg
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
  >
    <path
      d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z"
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
    />
  </svg>
);

interface NavLinkItem {
  href: string;
  label: string;
  external?: boolean;
}

interface NavbarPopoverProps {
  navLinks: NavLinkItem[];
  currentPath: string;
}

function isActive(href: string, currentPath: string): boolean {
  if (href.startsWith("http")) return false;
  return currentPath.startsWith(href);
}

export default function NavbarPopover({
  navLinks,
  currentPath,
}: NavbarPopoverProps) {
  return (
    <Popover.Root>
      <Popover.Trigger className="inline-flex md:hidden" title="Menu">
        <HamburgerIcon />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content sideOffset={24}>
          <div className="flex w-[var(--radix-popover-content-available-width)] flex-col gap-y-6 bg-slate-200/40 px-4 py-2 shadow-xs backdrop-blur-xs dark:bg-slate-900/40">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className={clsx(
                  "relative before:absolute before:-bottom-0.5 before:left-0 before:block before:h-0.5 before:w-full before:scale-0 before:bg-current before:transition-transform before:duration-300 before:ease-in-out hover:before:scale-100",
                  isActive(link.href, currentPath) &&
                    "text-gray-900 before:scale-100 dark:text-gray-300",
                )}
              >
                {link.label}
              </a>
            ))}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
