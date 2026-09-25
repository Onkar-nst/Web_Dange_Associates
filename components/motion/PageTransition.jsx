"use client";

import { motion } from "framer-motion";

// Opacity-only so fixed/sticky children (navbar, 3D stage) keep working.
export default function PageTransition({ children }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, ease: "easeOut" }}>
      {children}
    </motion.div>
  );
}
