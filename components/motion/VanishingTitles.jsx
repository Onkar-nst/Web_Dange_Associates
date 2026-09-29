"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Site-wide "vanishing" titles: every h1/h2 outside the navbar and footer fades, blurs and drifts up as it
// scrolls away under the navbar, and fades/sharpens in the same way as it rises into view from the bottom.
// Uses the standalone `translate` property so it never fights framer-motion's `transform`.
// Opt a heading out with data-no-vanish.
const START = 140; // px from viewport top (just under the navbar) where the fade begins
const DISTANCE = 180; // px of travel over which it fully vanishes / appears
const ENTER_END = 60; // px above the viewport bottom where an arriving title starts to appear

const clamp = (v) => Math.min(1, Math.max(0, v));

export default function VanishingTitles() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      document.querySelectorAll("h1, h2").forEach((el) => {
        if (el.closest("nav, footer, [data-no-vanish]")) return;
        const top = el.getBoundingClientRect().top;
        const vh = window.innerHeight;
        // Leaving at the top: drift up. Arriving from the bottom: rise into place.
        const leave = clamp((START - top) / DISTANCE);
        const enter = clamp((top - (vh - ENTER_END - DISTANCE)) / DISTANCE);
        const p = Math.max(leave, enter);
        const dir = leave >= enter ? -1 : 1;
        if (p === 0) {
          if (el.style.opacity) {
            el.style.opacity = "";
            el.style.filter = "";
            el.style.translate = "";
          }
          return;
        }
        el.style.opacity = String(1 - p);
        el.style.filter = `blur(${(p * 8).toFixed(2)}px)`;
        el.style.translate = `0 ${(dir * p * 24).toFixed(1)}px`;
      });
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  return null;
}
