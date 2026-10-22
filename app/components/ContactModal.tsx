"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Status = "idle" | "sending" | "done" | "error";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const field =
  "f-serif w-full border-0 border-b-2 border-black bg-transparent px-0 py-2 text-xl outline-none placeholder:text-neutral-400 focus:border-b-4";

export default function ContactModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverMsg, setServerMsg] = useState("");
  const [emailSent, setEmailSent] = useState(true);
  const first = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    const t = window.setTimeout(() => first.current?.focus(), 80);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
    };
  }, [open, onClose]);

  const close = () => {
    onClose();
    window.setTimeout(() => { setStatus("idle"); setErrors({}); setServerMsg(""); }, 300);
  };

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      message: String(fd.get("message") ?? "").trim(),
    };

    const errs: Record<string, string> = {};
    if (!payload.name) errs.name = "Enter your name.";
    if (!EMAIL_RE.test(payload.email)) errs.email = "Enter a valid email address.";
    if (!payload.message) errs.message = "Enter a message.";
    setErrors(errs); setServerMsg("");
    if (Object.keys(errs).length) return;

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; emailSent?: boolean; errors?: Record<string, string>; error?: string };
      if (res.ok && data.ok) {
        setEmailSent(Boolean(data.emailSent));
        setStatus("done");
        form.reset();
      } else {
        setErrors(data.errors ?? {});
        setServerMsg(data.error ?? "Something went wrong. Check the form and try again.");
        setStatus("error");
      }
    } catch {
      setServerMsg("Could not reach the server. Check your connection and try again.");
      setStatus("error");
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onMouseDown={(e) => { if (e.target === e.currentTarget) close(); }}
        >
          <motion.div
            role="dialog" aria-modal="true" aria-label="Contact"
            className="max-h-[92vh] w-full max-w-[640px] overflow-y-auto border border-black bg-white"
            initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between bg-black px-5 py-3 text-white">
              <span className="text-[10px] tracking-[0.5em]">CONTACT</span>
              <button onClick={close} className="text-[10px] tracking-[0.3em] hover:underline">CLOSE</button>
            </div>

            {status === "done" ? (
              <div className="px-6 py-14 md:px-10">
                <h2 className="f-display text-6xl uppercase leading-none">Received</h2>
                <p className="f-serif mt-6 text-xl leading-8">
                  Thanks for reaching out. Your message has been received and we&apos;ll get back to you soon.
                  {emailSent ? " A confirmation is on its way to your inbox." : " We couldn\u2019t send a confirmation email, but your message is saved."}
                </p>
                <button onClick={close} className="mt-10 border border-black px-8 py-4 text-[11px] tracking-[0.35em] hover:bg-black hover:text-white">
                  BACK TO SITE
                </button>
              </div>
            ) : (
              <form onSubmit={submit} noValidate className="space-y-8 px-6 py-10 md:px-10">
                <h2 className="f-serif text-3xl leading-tight md:text-4xl">Tell me what you&apos;re building.</h2>

                {(["name", "email", "message"] as const).map((n) => (
                  <label key={n} className="block">
                    <span className="text-[10px] tracking-[0.35em]">{n.toUpperCase()}</span>
                    {n === "message" ? (
                      <textarea name={n} rows={4} maxLength={2000} className={`${field} resize-none`} placeholder="Project, timeline, budget" />
                    ) : (
                      <input
                        ref={n === "name" ? first : undefined}
                        name={n} type={n === "email" ? "email" : "text"} maxLength={n === "email" ? 200 : 100}
                        autoComplete={n} className={field} placeholder={n === "name" ? "Your name" : "you@company.com"}
                      />
                    )}
                    {errors[n] && <span role="alert" className="mt-1 block text-sm font-semibold">{errors[n]}</span>}
                  </label>
                ))}

                {serverMsg && <p role="alert" className="border border-black p-3 text-sm">{serverMsg}</p>}

                <button
                  type="submit" disabled={status === "sending"}
                  className="w-full bg-black py-5 text-[11px] tracking-[0.4em] text-white transition-opacity disabled:opacity-50"
                >
                  {status === "sending" ? "SENDING..." : "SEND MESSAGE"}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
