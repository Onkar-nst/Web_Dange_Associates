"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// Words light up one after another as the paragraph scrolls through the viewport.
function Word({ children, progress, range }) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  const y = useTransform(progress, range, [6, 0]);
  return (
    <span className="relative mr-[0.25em] inline-block">
      <motion.span style={{ opacity, y }} className="inline-block">
        {children}
      </motion.span>
    </span>
  );
}

export default function ScrollWords({ text, className = "", as: Tag = "p" }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = String(text).split(" ");
  return (
    <Tag ref={ref} className={className}>
      {words.map((w, i) => (
        <Word key={`${w}-${i}`} progress={scrollYProgress} range={[i / words.length, Math.min(1, (i + 1.5) / words.length)]}>
          {w}
        </Word>
      ))}
    </Tag>
  );
}
