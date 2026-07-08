"use client";

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import {
  motion,
  useSpring,
  useMotionValue,
  useReducedMotion,
} from "motion/react";
import clsx from "clsx";

interface Section {
  id: string;
  title: string;
  level: number;
}

function extractSections(articleEl: HTMLElement): Section[] {
  const headings = articleEl.querySelectorAll("h2, h3");
  return Array.from(headings)
    .filter((h) => h.id)
    .map((h) => ({
      id: h.id,
      title: h.textContent ?? "",
      level: h.tagName === "H2" ? 2 : 3,
    }));
}

export function ScrollIndicator() {
  const [sections, setSections] = useState<Section[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [, forceRender] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const progressY = useMotionValue(0);
  const smoothY = useSpring(progressY, {
    stiffness: reduceMotion ? 1000 : 300,
    damping: reduceMotion ? 100 : 30,
  });

  const filteredSections = sections.filter(
    (s) => s.level === 2 || s.level === 3,
  );
  const totalTicks = 60;

  // Read height directly from DOM ref — no state lag
  const trackHeight = trackRef.current?.clientHeight ?? 0;

  // Discover sections from the article DOM
  useEffect(() => {
    const article = document.querySelector("article");
    if (!article) return;

    const discovered = extractSections(article);
    setSections(discovered);

    // Watch for DOM changes (e.g. lazy-loaded components may add headings)
    const observer = new MutationObserver(() => {
      const updated = extractSections(article);
      setSections(updated);
    });
    observer.observe(article, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  // Force re-render after mount so trackRef picks up the real height
  useEffect(() => {
    forceRender((n) => n + 1);

    const handleResize = () => forceRender((n) => n + 1);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Track active section via IntersectionObserver
  useEffect(() => {
    if (filteredSections.length === 0) return;

    const observers: IntersectionObserver[] = [];

    filteredSections.forEach((section, i) => {
      const el = document.getElementById(section.id);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            setActiveIndex(i);
          }
        },
        { rootMargin: "-20% 0px -70% 0px" },
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [filteredSections]);

  // Smooth progress to active section
  useEffect(() => {
    if (trackHeight <= 0 || filteredSections.length === 0) return;
    const targetY =
      (activeIndex / Math.max(filteredSections.length - 1, 1)) * trackHeight;
    progressY.set(targetY);
  }, [activeIndex, trackHeight, filteredSections.length, progressY]);

  const handleClick = (index: number) => {
    const section = filteredSections[index];
    if (!section) return;
    const el = document.getElementById(section.id);
    if (!el) return;

    // Find the actual scroll container (TanStack Start uses a grid layout
    // where scrolling happens in an inner div, not the window)
    const scrollContainer =
      el.closest<HTMLElement>("[class*='overflow']") ??
      document.scrollingElement;
    if (scrollContainer) {
      const top =
        el.getBoundingClientRect().top -
        scrollContainer.getBoundingClientRect().top +
        scrollContainer.scrollTop;
      scrollContainer.scrollTo({ top, behavior: "smooth" });
    } else {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Don't render if no sections found or only 1 section
  if (filteredSections.length <= 1) return null;

  const content = (
    <div
      className="fixed top-1/2 right-6 z-30 hidden h-[min(50vh,400px)] -translate-y-1/2 lg:block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Invisible hover pad extending left to cover label area */}
      <div className="pointer-events-auto absolute inset-y-0 right-0 -left-[160px]" />
      <div ref={trackRef} className="relative h-full">
        <div className="absolute inset-0">
          {/* Tick marks */}
          {Array.from({ length: totalTicks }).map((_, i) => {
            const y = (i / (totalTicks - 1)) * trackHeight;
            const isMajor = i % 5 === 0;
            const isPast =
              i / (totalTicks - 1) <=
              activeIndex / Math.max(filteredSections.length - 1, 1);

            return (
              <div
                key={i}
                className="absolute right-0 flex items-center"
                style={{ top: `${y}px` }}
              >
                <div
                  className={clsx(
                    "h-px transition-all duration-150",
                    isMajor ? "w-3" : "w-1.5",
                    isPast
                      ? "bg-slate-700 dark:bg-slate-300"
                      : isMajor
                        ? "bg-slate-700/50 dark:bg-slate-300/50"
                        : "bg-slate-700/25 dark:bg-slate-300/25",
                  )}
                />
              </div>
            );
          })}

          {/* Section markers */}
          {filteredSections.map((section, i) => {
            const y =
              (i / Math.max(filteredSections.length - 1, 1)) * trackHeight;
            const isActive = i === activeIndex;

            return (
              <div key={section.id}>
                {/* Section tick */}
                <div
                  className={clsx(
                    "absolute right-0 h-px transition-all duration-200",
                    section.level === 2 ? "w-4" : "w-3",
                    isActive
                      ? "bg-indigo-500 dark:bg-indigo-400"
                      : "bg-slate-700/60 dark:bg-slate-300/60",
                  )}
                  style={{ top: `${y}px` }}
                />

                {/* Section label (shown on hover) */}
                <div
                  className={clsx(
                    "absolute flex items-center",
                    reduceMotion ? "" : "transition-all duration-200",
                    isHovered
                      ? "translate-x-0 opacity-100"
                      : "translate-x-2 opacity-0",
                  )}
                  style={{
                    top: `${y - 7}px`,
                    right: "20px",
                    transitionDelay: isHovered ? `${i * 35}ms` : "0ms",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => handleClick(i)}
                    className={clsx(
                      "cursor-pointer whitespace-nowrap rounded-sm border-0 bg-transparent p-0 font-mono text-[11px] tracking-wider uppercase",
                      "transition-colors duration-150",
                      "focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-indigo-500 focus-visible:ring-offset-1 focus-visible:ring-offset-slate-50 dark:focus-visible:ring-offset-slate-800",
                      isActive
                        ? "text-indigo-600 dark:text-indigo-400"
                        : "text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300",
                    )}
                  >
                    {section.title}
                  </button>
                </div>
              </div>
            );
          })}

          {/* Animated position indicator */}
          <motion.div
            className="absolute right-0 z-20"
            style={{ top: smoothY }}
          >
            <div className="h-px w-4 bg-indigo-500 dark:bg-indigo-400" />
            {/* Position readout */}
            <div
              className={clsx(
                "absolute top-0 -left-8 -translate-y-1/2 transition-opacity duration-200",
                isHovered ? "opacity-0" : "opacity-100",
              )}
            >
              <span className="font-mono text-[10px] text-indigo-500 tabular-nums dark:text-indigo-400">
                {filteredSections.length > 0
                  ? `${activeIndex + 1}/${filteredSections.length}`
                  : "0/0"}
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );

  if (typeof document === "undefined") return null;
  return createPortal(content, document.body);
}
