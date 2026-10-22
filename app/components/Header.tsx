"use client";

import { useState } from "react";

const LINKS = [
  ["KNOW ME", "#about"],
  ["WORKS", "#works"],
  ["MEMORY TUNNEL", "#memory"],
  ["PLAY ME OUT", "#play"],
] as const;

const QR = ["1110111", "1010101", "1110111", "0001000", "1101011", "0111010", "1010111"];

function QrMark() {
  return (
    <svg viewBox="0 0 7 7" className="h-10 w-10" aria-hidden="true">
      {QR.flatMap((row, y) =>
        row.split("").map((c, x) => (c === "1" ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="#000" /> : null))
      )}
    </svg>
  );
}

export default function Header({ onContact }: { onContact: () => void }) {
  const [menu, setMenu] = useState(false);

  return (
    <>
      {/* Desktop */}
      <header className="fixed inset-x-0 top-0 z-50 hidden h-[88px] border-b border-black bg-white lg:block">
        <div className="grid h-full grid-cols-[88px_140px_1fr_72px_340px]">
          <a href="#top" className="f-serif flex items-center justify-center border-r border-black text-4xl">A</a>
          <div className="flex items-center justify-center border-r border-black text-sm tracking-[0.35em]">ARYAN</div>
          <nav className="flex items-center justify-around px-6 text-[11px] tracking-[0.25em]">
            {LINKS.map(([label, href]) => (
              <a key={href} href={href} className="hover:underline">{label}</a>
            ))}
          </nav>
          <div className="flex flex-col items-center justify-center gap-2 border-x border-black text-sm">
            <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:underline">in</a>
            <a href="https://github.com/" target="_blank" rel="noreferrer" aria-label="GitHub" className="hover:underline">gh</a>
          </div>
          <div className="flex items-center justify-between gap-3 px-5 text-[11px]">
            <div>
              <p className="f-serif italic">Design-led product engineering.</p>
              <div className="my-2 border-t border-black" />
              <p>
                Partnerships, retainers, builds:{" "}
                <button onClick={onContact} className="font-bold underline">Get in touch</button>
              </p>
            </div>
            <QrMark />
          </div>
        </div>
      </header>

      {/* Mobile / tablet */}
      <header className="fixed inset-x-0 top-0 z-50 flex h-16 items-stretch border-b border-black bg-white lg:hidden">
        <a href="#top" className="f-serif flex w-16 items-center justify-center border-r border-black text-3xl">A</a>
        <div className="flex flex-1 items-center px-4 text-xs tracking-[0.35em]">ARYAN</div>
        <button
          onClick={() => setMenu((m) => !m)}
          aria-expanded={menu}
          className="border-l border-black px-5 text-[11px] tracking-[0.25em]"
        >
          {menu ? "CLOSE" : "MENU"}
        </button>
      </header>

      {menu && (
        <div className="fixed inset-0 z-40 flex flex-col justify-between bg-black px-6 pb-8 pt-24 text-white lg:hidden">
          <nav className="flex flex-col gap-2">
            {LINKS.map(([label, href]) => (
              <a key={href} href={href} onClick={() => setMenu(false)} className="f-display text-5xl uppercase leading-tight">
                {label}
              </a>
            ))}
          </nav>
          <div>
            <p className="f-serif mb-3 italic">Design-led product engineering.</p>
            <button
              onClick={() => { setMenu(false); onContact(); }}
              className="w-full border border-white py-4 text-xs tracking-[0.35em]"
            >
              GET IN TOUCH
            </button>
          </div>
        </div>
      )}
    </>
  );
}
