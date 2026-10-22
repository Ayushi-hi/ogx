"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Works() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["14%", "-14%"]);
  const scale = useTransform(scrollYProgress, [0, 0.45, 1], [0.35, 1, 14]);
  const labelOpacity = useTransform(scrollYProgress, [0.55, 0.75], [1, 0]);

  return (
    <section id="works" ref={ref} className="ogx-grid relative h-[220vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        <motion.div style={{ x }} className="f-display pointer-events-none select-none whitespace-nowrap text-[58vw] uppercase leading-none tracking-[-0.02em]">
          Work
        </motion.div>

        <motion.a
          href="#memory"
          style={{ scale }}
          aria-label="Enter the memory tunnel"
          className="f-display absolute flex h-40 w-40 items-center justify-center rounded-full bg-black text-7xl text-white"
        >
          <motion.span style={{ opacity: labelOpacity }}>W</motion.span>
        </motion.a>
      </div>
    </section>
  );
}
