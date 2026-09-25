"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";

// Animates the numeric part of a value like "1200+" or "18+" when it comes into view.
export default function CountUp({ value, duration = 2 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const match = String(value).match(/^(\D*)(\d+)(.*)$/);
  const [display, setDisplay] = useState(match ? `${match[1]}0${match[3]}` : value);

  useEffect(() => {
    if (!inView || !match) return;
    const target = parseInt(match[2], 10);
    const controls = animate(0, target, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(`${match[1]}${Math.round(v)}${match[3]}`),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return <span ref={ref}>{match ? display : value}</span>;
}
