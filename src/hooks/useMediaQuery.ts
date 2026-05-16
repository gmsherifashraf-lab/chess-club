"use client";

import { useEffect, useState } from "react";

/**
 * SSR-safe media query hook. Returns false on the server and first
 * client paint, then resolves after mount so there is no hydration
 * mismatch. Use to drop expensive animations on small screens.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

/** True on phone-width viewports (coarse, ≤ 640px). */
export function useIsMobile(): boolean {
  return useMediaQuery("(max-width: 640px)");
}
