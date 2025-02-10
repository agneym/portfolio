let defaultId = "reach-skip-nav";

////////////////////////////////////////////////////////////////////////////////

/**
 * SkipNavLink
 *
 * Renders a link that remains hidden until focused to skip to the main content.
 *
 * @see Docs https://reach.tech/skip-nav#skipnavlink
 */
function SkipNavLink({
  as: Comp = "a",
  children = "Skip to content",
  contentId,
  ref: forwardedRef,
  ...props
}) {
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

////////////////////////////////////////////////////////////////////////////////

/**
 * SkipNavContent
 *
 * Renders a div as the target for the link.
 *
 * @see Docs https://reach.tech/skip-nav#skipnavcontent
 */
function SkipNavContent({
  as: Comp = "div",
  id: idProp,
  ref: forwardedRef,
  ...props
}) {
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

export { SkipNavLink, SkipNavContent };
