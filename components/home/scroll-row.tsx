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
        suppressHydrationWarning
        type="button"
        onClick={() => scroll(-1)}
        className="absolute left-1 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white text-xl text-coal/60 shadow-panel hover:text-coal"
        aria-label={`Previous ${ariaLabel}`}
      >
        ‹
      </button>
      <div ref={rowRef} className={`${className} scroll-smooth`} tabIndex={0}>
        {children}
      </div>
      <button
        suppressHydrationWarning
        type="button"
        onClick={() => scroll(1)}
        className="absolute right-1 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white text-xl text-coal/60 shadow-panel hover:text-coal"
        aria-label={`Next ${ariaLabel}`}
      >
        ›
      </button>
    </div>
  );
}
