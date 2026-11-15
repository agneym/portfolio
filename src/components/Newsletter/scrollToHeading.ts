/** Gap kept between the viewport top (under the site header) and the heading. */
const SCROLL_OFFSET = 104;

function getScroller(el: HTMLElement) {
  for (let node = el.parentElement; node; node = node.parentElement) {
    const { overflowY } = getComputedStyle(node);
    if (
      /(auto|scroll)/.test(overflowY) &&
      node.scrollHeight > node.clientHeight
    )
      return node;
  }
  return document.scrollingElement as HTMLElement;
}

let cancelScroll: (() => void) | undefined;

/** Eased scroll; duration grows with distance. Cancelled by user input. */
export function scrollToHeading(id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  cancelScroll?.();

  const scroller = getScroller(target);
  const from = scroller.scrollTop;
  const to = Math.max(
    0,
    from +
      target.getBoundingClientRect().top -
      (scroller === document.scrollingElement
        ? 0
        : scroller.getBoundingClientRect().top) -
      SCROLL_OFFSET,
  );
  history.replaceState(null, "", `#${id}`);

  const distance = to - from;
  if (
    Math.abs(distance) < 2 ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    scroller.scrollTop = to;
    return;
  }

  const duration = Math.min(1100, Math.max(450, Math.abs(distance) * 0.35));
  const start = performance.now();
  let frame = 0;
  const stop = () => {
    cancelAnimationFrame(frame);
    scroller.removeEventListener("wheel", stop);
    scroller.removeEventListener("touchstart", stop);
    scroller.removeEventListener("keydown", stop);
    cancelScroll = undefined;
  };
  const step = (now: number) => {
    const t = Math.min(1, (now - start) / duration);
    const eased = t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;
    scroller.scrollTop = from + distance * eased;
    if (t < 1) frame = requestAnimationFrame(step);
    else stop();
  };
  scroller.addEventListener("wheel", stop, { passive: true });
  scroller.addEventListener("touchstart", stop, { passive: true });
  scroller.addEventListener("keydown", stop);
  cancelScroll = stop;
  frame = requestAnimationFrame(step);
}
