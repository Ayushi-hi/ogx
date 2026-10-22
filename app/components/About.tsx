function Bar({ children }: { children: string }) {
  return <div className="bg-black py-3 text-center text-[10px] tracking-[0.5em] text-white">{children}</div>;
}

const STACK = ["MongoDB", "Express", "React", "Node.js", "Next.js", "TypeScript", "Tailwind CSS", "WordPress", "Shopify", "Framer"];

export default function About() {
  return (
    <section id="about" className="relative overflow-hidden bg-white px-4 py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0 [perspective:700px]" aria-hidden="true">
        <div className="ogx-floor absolute -inset-x-1/2 -inset-y-1/4 [transform:rotateX(58deg)]" />
      </div>

      <div className="relative mx-auto max-w-[780px] border border-black bg-white">
        <Bar>ABOUT</Bar>
        <div className="px-6 py-12 md:px-12 md:py-16">
          <h2 className="f-serif text-3xl leading-[1.25] md:text-5xl">
            I collaborate with agencies, designers, and businesses to build impactful digital experiences&mdash;turning ideas into scalable, high-performance products.
          </h2>
          <div className="f-serif mt-10 space-y-6 text-base leading-8 md:text-lg">
            <p>I&apos;ve developed multiple projects using the MERN stack and platforms like WordPress, Shopify, and Framer. My work includes building CRMs, HRMSs, custom tools, and other complex systems tailored to real business needs.</p>
            <p>I&apos;m known for my ability to transform complex designs into efficient, scalable systems&mdash;combining solid engineering with strong business understanding.</p>
            <p>I focus on creating solutions that are not just visually compelling, but technically robust and built for growth.</p>
            <p>I founded <u>OGX Studio</u> and XienOS (in progress), and continue to build, experiment, and create.</p>
          </div>
        </div>

        <Bar>APPROACH</Bar>
        <div className="px-6 py-12 md:px-12">
          <p className="f-serif text-xl leading-9">
            I focus on solving the right problems, not just building features. My approach combines clean engineering with business understanding to create scalable, high-performance systems.
          </p>
        </div>

        <Bar>STACK</Bar>
        <ul className="grid grid-cols-2 md:grid-cols-5">
          {STACK.map((s) => (
            <li key={s} className="f-serif border-b border-r border-black px-4 py-5 text-center text-sm [&:nth-child(2n)]:border-r-0 md:[&:nth-child(2n)]:border-r md:[&:nth-child(5n)]:border-r-0 [&:nth-last-child(-n+2)]:border-b-0 md:[&:nth-last-child(-n+5)]:border-b-0">
              {s}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
