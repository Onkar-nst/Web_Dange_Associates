"use client";

import { useRef } from "react";

// Soft light that follows the pointer across a card.
export default function Spotlight({ children, className = "", color = "rgba(59,130,246,0.12)", as: Tag = "div", ...rest }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--sx", `${e.clientX - r.left}px`);
    ref.current.style.setProperty("--sy", `${e.clientY - r.top}px`);
  };
  return (
    <Tag ref={ref} onPointerMove={onMove} className={`group/spot relative [&>*:not([data-spot])]:relative ${className}`} {...rest}>
      <span
        data-spot
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover/spot:opacity-100"
        style={{ background: `radial-gradient(420px circle at var(--sx, 50%) var(--sy, 50%), ${color}, transparent 60%)` }}
      />
      {children}
    </Tag>
  );
}
