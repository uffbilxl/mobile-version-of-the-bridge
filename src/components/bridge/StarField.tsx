import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

interface Dot {
  x: number; y: number; r: number;
  color: string; speed: number; offset: number;
}

export function StarField({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0;
    let dots: Dot[] = [];
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    let raf = 0;
    let visible = true;
    let start = performance.now();

    const colorRoll = () => {
      const r = Math.random();
      if (r < 0.7) return "rgba(255,255,255,0.6)";
      if (r < 0.9) return "rgba(167,139,250,0.7)";
      return "rgba(245,200,66,0.8)";
    };
    const sizeRoll = () => {
      const r = Math.random();
      if (r < 0.8) return 1;
      if (r < 0.95) return 1.5;
      return 2;
    };

    const seed = () => {
      dots = Array.from({ length: 180 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: sizeRoll(),
        color: colorRoll(),
        speed: 0.3 + Math.random() * 0.5,
        offset: Math.random() * Math.PI * 2,
      }));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.tx = (e.clientX - rect.left - w / 2) * 0.02;
      mouse.ty = (e.clientY - rect.top - h / 2) * 0.02;
    };

    const onVis = () => { visible = !document.hidden; if (visible) loop(performance.now()); };

    const loop = (t: number) => {
      if (!visible) return;
      const time = (t - start) / 1000;
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
      ctx.clearRect(0, 0, w, h);
      for (const d of dots) {
        const a = 0.35 + 0.5 * (0.5 + 0.5 * Math.sin(time * d.speed + d.offset));
        ctx.globalAlpha = a;
        ctx.fillStyle = d.color;
        ctx.beginPath();
        ctx.arc(d.x + mouse.x, d.y + mouse.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(loop);
    };

    resize();
    raf = requestAnimationFrame(loop);
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [reduce]);

  return <canvas ref={ref} aria-hidden className={"absolute inset-0 h-full w-full " + className} />;
}
