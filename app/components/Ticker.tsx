const CELLS = [
  "////////////////////////",
  "060606060606060606",
  "////////////////////////",
  "0 1 0 1 1 0 1 0 0 1 1 0",
  "////////////////////////",
  "20262026202620262026",
  "////////////////////////",
  "060606060606060606",
];

export default function Ticker() {
  const row = [...CELLS, ...CELLS];
  return (
    <div className="ogx-ticker overflow-hidden border-y border-black bg-white" aria-hidden="true">
      <div className="ogx-marquee flex h-10 w-max">
        {row.map((c, i) => (
          <div key={i} className="flex min-w-[240px] items-center justify-center border-r border-black px-4 text-[9px] tracking-[0.2em]">
            {c}
          </div>
        ))}
      </div>
    </div>
  );
}
