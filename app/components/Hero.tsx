"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

function WaveCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mouse = { x: -9999, y: -9999 };
    let w = 0, h = 0, raf = 0, visible = true;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.strokeStyle = "rgba(0,0,0,0.6)";
      ctx.lineWidth = 0.8;
    };

    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      if (!visible) return;
      const time = reduce ? 0 : t / 1000;
      const gap = w < 700 ? 9 : 7;
      ctx.clearRect(0, 0, w, h);
      ctx.beginPath();
      for (let x0 = -gap; x0 <= w + gap; x0 += gap) {
        for (let y = 0; y <= h + 10; y += 10) {
          const nx = x0 / w, ny = y / h;
          let x = x0 + Math.sin(ny * 5 + time * 0.8 + nx * 7) * 16 + Math.sin(ny * 13 - time * 0.6 + nx * 3) * 6;
          const dx = x - mouse.x, dy = y - mouse.y;
          x += dx * Math.exp(-(dx * dx + dy * dy) / (2 * 170 * 170)) * 0.5;
          if (y === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(canvas);
    window.addEventListener("pointermove", onMove);
    resize();
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <canvas ref={ref} className="absolute inset-0 h-full w-full" aria-hidden="true" />;
}

const rise = (delay: number) => ({
  initial: { y: "110%" },
  animate: { y: "0%" },
  transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] as const },
});

export default function Hero({ onContact }: { onContact: () => void }) {
  return (
    <section id="top" className="relative flex min-h-screen flex-col justify-end overflow-hidden pt-16 lg:pt-[88px]">
      <WaveCanvas />

      <div className="relative z-10 px-4 pb-10">
        <h1 className="f-display flex flex-col items-center justify-center gap-y-1 text-center text-[clamp(64px,18vw,96px)] uppercase leading-[0.85] tracking-[-0.01em] sm:flex-row sm:flex-wrap sm:gap-x-[0.18em] sm:text-[clamp(56px,11.5vw,210px)]">
          <span className="block overflow-hidden"><motion.span className="block" {...rise(0)}>Creative</motion.span></span>
          <span className="block overflow-hidden">
            <motion.span
              className="block text-[0.6em]"
              initial={{ y: "110%", rotate: -90 }}
              animate={{ y: "0%", rotate: 0 }}
              transition={{ duration: 1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              {"\u2726"}
            </motion.span>
          </span>
          <span className="block overflow-hidden"><motion.span className="block" {...rise(0.15)}>Developer</motion.span></span>
        </h1>

        <div className="mt-8 flex justify-center">
          <button
            onClick={onContact}
            className="border border-black bg-white px-8 py-4 text-[11px] tracking-[0.35em] transition-colors hover:bg-black hover:text-white"
          >
            GET IN TOUCH
          </button>
        </div>
      </div>
    </section>
  );
}
