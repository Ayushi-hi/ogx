"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const WHITE_PATTERN = [0, 2, 4, 5, 7, 9, 11];
const BLACK_AFTER: Record<number, number> = { 0: 1, 1: 3, 3: 6, 4: 8, 5: 10 }; // white index in octave -> semitone
const KEYMAP = "awsedftgyhujkolp;'"; // index = semitone from C4

const WHITES: number[] = [];
for (let o = 0; o < 2; o++) for (const s of WHITE_PATTERN) WHITES.push(o * 12 + s);
WHITES.push(24);

const BLACKS: { semi: number; left: number }[] = [];
WHITES.forEach((_, i) => {
  const inOct = i % 7;
  if (i < WHITES.length - 1 && inOct in BLACK_AFTER) {
    BLACKS.push({ semi: Math.floor(i / 7) * 12 + BLACK_AFTER[inOct], left: ((i + 1) / WHITES.length) * 100 });
  }
});

export default function PlayMeOut() {
  const audio = useRef<AudioContext | null>(null);
  const [active, setActive] = useState<Set<number>>(new Set());

  const play = useCallback((semi: number) => {
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!audio.current) audio.current = new Ctor();
    const ctx = audio.current;
    if (ctx.state === "suspended") void ctx.resume();
    const o = ctx.createOscillator(), g = ctx.createGain(), now = ctx.currentTime;
    o.type = "triangle";
    o.frequency.value = 261.63 * Math.pow(2, semi / 12);
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.35, now + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 1.3);
    o.connect(g).connect(ctx.destination);
    o.start(now); o.stop(now + 1.4);
    setActive((a) => new Set(a).add(semi));
    window.setTimeout(() => setActive((a) => { const n = new Set(a); n.delete(semi); return n; }), 180);
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
      const i = KEYMAP.indexOf(e.key.toLowerCase());
      if (i >= 0) play(i);
    };
    window.addEventListener("keydown", down);
    return () => window.removeEventListener("keydown", down);
  }, [play]);

  return (
    <section id="play" className="ogx-grid px-4 py-20 md:py-28">
      <div className="mx-auto max-w-[1100px] border border-black bg-white">
        <div className="bg-black py-3 text-center text-[10px] tracking-[0.5em] text-white">PLAY ME OUT</div>
        <div className="overflow-x-auto">
          <div className="relative mx-auto flex h-[260px] min-w-[760px] md:h-[320px]" role="group" aria-label="Piano">
            {WHITES.map((semi) => (
              <button
                key={semi}
                onPointerDown={() => play(semi)}
                aria-label={`Note ${semi}`}
                className={`h-full flex-1 border-r border-black transition-colors last:border-r-0 ${active.has(semi) ? "bg-black" : "bg-white hover:bg-neutral-200"}`}
              />
            ))}
            {BLACKS.map(({ semi, left }) => (
              <button
                key={semi}
                onPointerDown={() => play(semi)}
                aria-label={`Note ${semi}`}
                style={{ left: `${left}%`, width: "4.2%" }}
                className={`absolute top-0 h-[60%] -translate-x-1/2 border border-black ${active.has(semi) ? "bg-white" : "bg-black"}`}
              />
            ))}
          </div>
        </div>
        <p className="f-serif border-t border-black px-6 py-4 text-center text-sm italic">
          Tap the keys, or play with your keyboard: A W S E D F T G Y H U J K.
        </p>
      </div>
    </section>
  );
}
