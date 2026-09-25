"use client";

import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];

// Fades/slides its children in when they scroll into view.
export default function Reveal({ children, delay = 0, y = 32, x = 0, className = "", as = "div", once = true, amount = 0.2 }) {
  const Tag = motion[as] ?? motion.div;
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once, amount }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </Tag>
  );
}

export const stagger = (gap = 0.1, delay = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: gap, delayChildren: delay } },
});

export const rise = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};
