import type { ComponentPropsWithRef, ElementType, ReactNode } from "react";

let defaultId = "reach-skip-nav";

type SkipNavLinkProps<T extends ElementType = "a"> = {
  as?: T;
  children?: ReactNode;
  contentId?: string;
} & Omit<ComponentPropsWithRef<T>, "as" | "children" | "contentId">;

////////////////////////////////////////////////////////////////////////////////

/**
 * SkipNavLink
 *
 * Renders a link that remains hidden until focused to skip to the main content.
 *
 * @see Docs https://reach.tech/skip-nav#skipnavlink
 */
export function SkipNavLink({
  as: Comp = "a",
  children = "Skip to content",
  contentId,
  ref: forwardedRef,
  ...props
}: SkipNavLinkProps) {
  let id = contentId || defaultId;
  return (
    <Comp
      {...props}
      ref={forwardedRef}
      href={`#${id}`}
      data-reach-skip-nav-link=""
    >
      {children}
    </Comp>
  );
}

type SkipNavContentProps<T extends ElementType = "div"> = {
  as?: T;
  id?: string;
} & Omit<ComponentPropsWithRef<T>, "as" | "id">;
////////////////////////////////////////////////////////////////////////////////

/**
 * SkipNavContent
 *
 * Renders a div as the target for the link.
 *
 * @see Docs https://reach.tech/skip-nav#skipnavcontent
 */
export function SkipNavContent({
  as: Comp = "div",
  id: idProp,
  ref: forwardedRef,
  ...props
}: SkipNavContentProps) {
  let id = idProp || defaultId;
  return (
    <Comp
      {...props}
      ref={forwardedRef}
      id={id}
      data-reach-skip-nav-content=""
    />
  );
}
