"use client";

import { useEffect, useRef } from "react";

// Isometric grid of land plots rising and falling like a wave (canvas, pauses off-screen).
export default function PlotWave({ className = "", cols = 30, rows = 30, tile = 40 }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const g = canvas.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let visible = false;
    let w = 0, h = 0, dpr = 1;
    const accent = new Set();
    for (let k = 0; k < 26; k++) accent.add(`${Math.floor(Math.random() * cols)}-${Math.floor(Math.random() * rows)}`);
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
    };
    const draw = (t) => {
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, w, h);
      const tw = tile, th = tile / 2;
      const ox = w / 2, oy = h / 2 - ((cols + rows) * th) / 2 + 40;
      for (let s = 0; s < cols + rows - 1; s++) {
        for (let i = 0; i < cols; i++) {
          const j = s - i;
          if (j < 0 || j >= rows) continue;
          const d = Math.hypot(i - cols / 2, j - rows / 2);
          const lift = (Math.sin(d * 0.55 - t * 0.0016) * 0.5 + 0.5) * 16 + 4;
          const x = ox + (i - j) * (tw / 2);
          const y = oy + (i + j) * (th / 2) - lift;
          const hot = accent.has(`${i}-${j}`);
          const k = lift / 20;
          g.beginPath();
          g.moveTo(x, y);
          g.lineTo(x + tw / 2 - 1, y + th / 2);
          g.lineTo(x, y + th - 1);
          g.lineTo(x - tw / 2 + 1, y + th / 2);
          g.closePath();
          g.fillStyle = hot ? `rgba(249,115,22,${0.35 + k * 0.45})` : `rgba(96,165,250,${0.06 + k * 0.16})`;
          g.fill();
          g.strokeStyle = hot ? "rgba(251,146,60,0.8)" : `rgba(147,197,253,${0.12 + k * 0.2})`;
          g.lineWidth = 1;
          g.stroke();
          // sides
          g.beginPath();
          g.moveTo(x - tw / 2 + 1, y + th / 2);
          g.lineTo(x, y + th - 1);
          g.lineTo(x, y + th - 1 + lift * 0.6);
          g.lineTo(x - tw / 2 + 1, y + th / 2 + lift * 0.6);
          g.closePath();
          g.fillStyle = hot ? "rgba(194,65,12,0.35)" : "rgba(30,64,175,0.08)";
          g.fill();
        }
      }
    };
    const loop = (t) => {
      raf = requestAnimationFrame(loop);
      if (visible) draw(t);
    };
    resize();
    draw(0);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);
    if (!reduce) raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [cols, rows, tile]);
  return <canvas ref={ref} aria-hidden className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} />;
}
