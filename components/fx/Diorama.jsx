"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Move3d } from "lucide-react";
import { useLanguage } from "../LanguageContext";

// Interactive, realistic 3D model (three.js). Drag to spin, hover to tilt, scroll to turn.
export default function Diorama({ variant = "home", className = "", hint = true, fallback = "/project-imgg-md.webp" }) {
  const { language } = useLanguage();
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const visibleRef = useRef(false);
  const dragRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [interacted, setInteracted] = useState(false);

  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start end", "end start"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => sceneRef.current?.setScroll(v - 0.5));

  useEffect(() => {
    let disposed = false;
    let scene;
    const probe = document.createElement("canvas");
    if (!(probe.getContext("webgl2") || probe.getContext("webgl"))) {
      setFailed(true);
      return;
    }
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    let started = false;
    const boot = async () => {
      if (started || disposed) return;
      started = true;
      nearIo.disconnect();
      try {
        const { default: DioramaScene } = await import("./dioramaScene");
        if (disposed) return;
        scene = new DioramaScene(canvasRef.current, { variant, isMobile, onReady: () => !disposed && setReady(true) });
        sceneRef.current = scene;
        await scene.init();
        if (!disposed && visibleRef.current) scene.start();
      } catch (err) {
        console.error("3D model failed to start", err);
        scene?.dispose();
        sceneRef.current = null;
        if (!disposed) setFailed(true);
      }
    };
    // Start after the page has painted and the main thread is idle.
    const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 600));
    const nearIo = new IntersectionObserver(([e]) => e.isIntersecting && idle(() => boot(), { timeout: 2500 }), { rootMargin: "30% 0px 30% 0px" });
    nearIo.observe(wrapRef.current);
    const io = new IntersectionObserver(([e]) => {
      visibleRef.current = e.isIntersecting;
      if (e.isIntersecting) sceneRef.current?.start();
      else sceneRef.current?.stop();
    });
    io.observe(wrapRef.current);
    const ro = new ResizeObserver(() => sceneRef.current?.resize());
    ro.observe(wrapRef.current);
    return () => {
      disposed = true;
      nearIo.disconnect();
      io.disconnect();
      ro.disconnect();
      scene?.dispose();
      sceneRef.current = null;
    };
  }, [variant]);

  const onPointerMove = (e) => {
    const r = wrapRef.current.getBoundingClientRect();
    sceneRef.current?.setPointer(((e.clientX - r.left) / r.width) * 2 - 1, -(((e.clientY - r.top) / r.height) * 2 - 1));
    if (dragRef.current !== null) {
      sceneRef.current?.dragBy(e.clientX - dragRef.current);
      dragRef.current = e.clientX;
    }
  };
  const onPointerDown = (e) => {
    dragRef.current = e.clientX;
    sceneRef.current?.setDragging(true);
    setInteracted(true);
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const endDrag = () => {
    dragRef.current = null;
    sceneRef.current?.setDragging(false);
  };

  if (failed) {
    return (
      <div className={`relative overflow-hidden rounded-[2rem] ${className}`}>
        <img src={fallback} alt="" className="h-full w-full object-cover" />
      </div>
    );
  }

  return (
    <div
      ref={wrapRef}
      data-cursor="drag"
      className={`${/\b(absolute|fixed)\b/.test(className) ? "" : "relative "}select-none touch-pan-y ${className}`}
      onPointerMove={onPointerMove}
      onPointerDown={onPointerDown}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerEnter={() => sceneRef.current?.setHover(true)}
      onPointerLeave={() => {
        endDrag();
        sceneRef.current?.setHover(false);
        sceneRef.current?.setPointer(0, 0);
      }}
    >
      <canvas ref={canvasRef} className={`absolute inset-0 h-full w-full transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`} />
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-40 w-40 animate-pulse rounded-[2rem] bg-gradient-to-br from-blue-100 via-white to-orange-100 [transform:rotateX(55deg)_rotateZ(45deg)]" />
        </div>
      )}
      {hint && ready && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: interacted ? 0 : 1, y: 0 }}
          transition={{ delay: interacted ? 0 : 1.2, duration: 0.5 }}
          className="pointer-events-none absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white bg-white/85 px-4 py-2 text-[11px] font-medium uppercase tracking-widest text-slate-700 shadow-lg backdrop-blur"
        >
          <Move3d className="h-4 w-4 text-blue-700" />
          {language === "en" ? "Drag to explore in 3D" : "3D मध्ये फिरवा"}
        </motion.div>
      )}
    </div>
  );
}
