import { useEffect, useState } from "react";
import { TOC_SCROLL_END, TOC_SCROLL_START } from "./scrollToHeading";

/** Distance from the viewport top at which a heading counts as "current". */
const ACTIVE_OFFSET = 120;

export function useActiveHeading(ids: readonly string[]) {
  const [active, setActive] = useState<string | undefined>(ids[0]);

  useEffect(() => {
    let frame = 0;
    // While a clicked link is scrolling, hold the target as active instead of
    // lighting up every heading the page passes on the way.
    let locked = false;
    const update = () => {
      frame = 0;
      if (locked) return;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= ACTIVE_OFFSET) current = id;
        else break;
      }
      setActive(current);
    };
    const onStart = (event: Event) => {
      locked = true;
      setActive((event as CustomEvent<string>).detail);
    };
    const onEnd = () => {
      locked = false;
      onScroll();
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    // The page scrolls inside a layout wrapper, not the window. Scroll events
    // don't bubble, so listen in the capture phase to catch any scroller.
    document.addEventListener("scroll", onScroll, {
      capture: true,
      passive: true,
    });
    window.addEventListener("resize", onScroll);
    window.addEventListener(TOC_SCROLL_START, onStart);
    window.addEventListener(TOC_SCROLL_END, onEnd);
    return () => {
      window.removeEventListener(TOC_SCROLL_START, onStart);
      window.removeEventListener(TOC_SCROLL_END, onEnd);
      document.removeEventListener("scroll", onScroll, { capture: true });
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ids]);

  return active;
}
