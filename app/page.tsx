"use client";

import { useCallback, useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Ticker from "./components/Ticker";
import About from "./components/About";
import Works from "./components/Works";
import MemoryTunnel from "./components/MemoryTunnel";
import PlayMeOut from "./components/PlayMeOut";
import ContactModal from "./components/ContactModal";

export default function Home() {
  const [contactOpen, setContactOpen] = useState(false);
  const openContact = useCallback(() => setContactOpen(true), []);
  const closeContact = useCallback(() => setContactOpen(false), []);

  return (
    <main className="overflow-x-hidden bg-white text-black">
      <Header onContact={openContact} />
      <Hero onContact={openContact} />
      <Ticker />
      <About />
      <Works />
      <MemoryTunnel />
      <PlayMeOut />
      <ContactModal open={contactOpen} onClose={closeContact} />
    </main>
  );
}
