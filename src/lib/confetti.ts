import confetti from "canvas-confetti";

export function celebrate() {
  if (typeof window === "undefined") return;
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: ["#7B5EA7", "#4A90D9", "#A78BFA", "#F5C842", "#00E5A0"],
    startVelocity: 35,
    gravity: 0.9,
    ticks: 200,
  });
}
