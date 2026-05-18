import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

export function ScrambleCounter({ value, duration = 1000 }: { value: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(() => "0".repeat(value.toString().length));
  const [pop, setPop] = useState(false);

  useEffect(() => {
    if (!inView) return;
    if (reduce) { setDisplay(value.toString()); return; }
    const target = value.toString();
    const len = target.length;
    const scramblePhase = duration * 0.6;
    const lockPhase = duration - scramblePhase;
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const elapsed = t - start;
      if (elapsed < scramblePhase) {
        const chars = target.split("").map(() => Math.floor(Math.random() * 10).toString()).join("");
        setDisplay(chars);
        raf = requestAnimationFrame(tick);
      } else if (elapsed < duration) {
        const p = (elapsed - scramblePhase) / lockPhase;
        const locked = Math.floor(p * len);
        const out = target.split("").map((c, i) => i < locked ? c : Math.floor(Math.random() * 10).toString()).join("");
        setDisplay(out);
        raf = requestAnimationFrame(tick);
      } else {
        setDisplay(target);
        setPop(true);
        setTimeout(() => setPop(false), 250);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration, reduce]);

  const formatted = display.length === value.toString().length
    ? Number(display).toLocaleString()
    : display;

  return (
    <span
      ref={ref}
      style={{ display: "inline-block", transition: "transform 250ms ease", transform: pop ? "scale(1.08)" : "scale(1)" }}
    >
      {formatted}
    </span>
  );
}
