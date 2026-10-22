"use client";

import { useEffect, useRef } from "react";

export default function MemoryTunnel() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const N = 16;
    const mouse = { x: 0.5, y: 0.5 };
    let w = 0, h = 0, raf = 0, last = 0, z = 0, boost = 0, lastY = window.scrollY, visible = false;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      const dt = Math.min((t - last) / 1000, 0.05); last = t;
      if (!visible) return;
      const dy = Math.abs(window.scrollY - lastY); lastY = window.scrollY;
      boost = Math.min(boost * 0.92 + dy * 0.02, 6);
      if (!reduce) z += (1.2 + boost) * dt;

      const vx = w / 2 + (mouse.x - 0.5) * w * 0.18;
      const vy = h / 2 + (mouse.y - 0.5) * h * 0.18;

      ctx.fillStyle = "#000"; ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "#fff"; ctx.lineWidth = 1;

      // radial guides to the frame edge
      ctx.globalAlpha = 0.5; ctx.beginPath();
      const pts: [number, number][] = [];
      for (let i = 0; i <= 8; i++) { pts.push([(i / 8) * w, 0], [(i / 8) * w, h]); }
      for (let i = 1; i < 6; i++) { pts.push([0, (i / 6) * h], [w, (i / 6) * h]); }
      for (const [px, py] of pts) { ctx.moveTo(vx + (px - vx) * 0.03, vy + (py - vy) * 0.03); ctx.lineTo(px, py); }
      ctx.stroke();

      // depth rings, closer = larger
      for (let k = 0; k < N; k++) {
        const p = ((k + z) % N) / N;
        const s = Math.pow(p, 3) * 1.7;
        ctx.globalAlpha = Math.min(1, p * 2.2);
        ctx.strokeRect(vx - (s * w) / 2, vy - (s * h) / 2, s * w, s * h);
      }
      ctx.globalAlpha = 1;
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = (e.clientX - r.left) / r.width; mouse.y = (e.clientY - r.top) / r.height;
    };
    const ro = new ResizeObserver(resize); ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }); io.observe(canvas);
    window.addEventListener("pointermove", onMove);
    resize();
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <section id="memory" className="relative h-screen min-h-[560px] bg-black text-white">
      <canvas ref={ref} className="absolute inset-0 h-full w-full" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between p-6 md:p-10">
        <h2 className="f-display text-[clamp(48px,12vw,180px)] uppercase leading-[0.85]">Memory<br />Tunnel</h2>
        <p className="f-serif hidden max-w-[220px] text-sm italic md:block">Move to steer. Scroll to travel faster.</p>
      </div>
    </section>
  );
}
