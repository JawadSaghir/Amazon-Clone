"use client";

import { ReactNode, useRef } from "react";

type ScrollRowProps = {
  children: ReactNode;
  ariaLabel: string;
  className: string;
};

export function ScrollRow({ children, ariaLabel, className }: ScrollRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  function scroll(direction: -1 | 1) {
    const row = rowRef.current;
    if (!row) return;
    row.scrollBy({ left: direction * Math.max(320, row.clientWidth * 0.75), behavior: "smooth" });
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => scroll(-1)}
        className="absolute left-1 top-1/2 z-10 -translate-y-1/2 bg-white/90 px-3 py-7 text-5xl text-coal/55 shadow-panel"
        aria-label={`Previous ${ariaLabel}`}
      >
        ‹
      </button>
      <div ref={rowRef} className={`${className} scroll-smooth`} tabIndex={0}>
        {children}
      </div>
      <button
        type="button"
        onClick={() => scroll(1)}
        className="absolute right-1 top-1/2 z-10 -translate-y-1/2 bg-white/90 px-3 py-7 text-5xl text-coal/55 shadow-panel"
        aria-label={`Next ${ariaLabel}`}
      >
        ›
      </button>
    </div>
  );
}
