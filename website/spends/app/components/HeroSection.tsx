"use client";

import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import TickerBanner from "./TickerBanner";

const pills = [
  { label: "Expense", color: "#F7CB46", text: "#282825", dot: "#D9313F" },
  { label: "Goals", color: "#A8FF57", text: "#282825", dot: "#00215E" },
  { label: "Payments", color: "#DE1A58", text: "#ffffff", dot: "#F7CB46" },
  { label: "Notes", color: "#00215E", text: "#ffffff", dot: "#A8FF57" },
];

// Scales font-size/padding down for longer labels so every pill occupies
// roughly the same width and none of them force the headline to wrap.
// Labels at or under `baseline` chars (e.g. "Expense", "Goals") render at full size.
function pillScale(label: string, baseline = 9) {
  return Math.min(1, baseline / label.length);
}

function pillFontSize(min: number, vw: number, max: number, scale: number) {
  return `clamp(${(min * scale).toFixed(1)}px, ${(vw * scale).toFixed(2)}vw, ${(max * scale).toFixed(1)}px)`;
}

export default function HeroSection() {
  const [pillIndex, setPillIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setPillIndex((p) => (p + 1) % pills.length);
    }, 2200);
    return () => clearInterval(t);
  }, []);

  const pill = pills[pillIndex];
  const scale = pillScale(pill.label);

  return (
    <section className="flex flex-col" style={{ backgroundColor: "#F9F5F2" }}>
      <Navbar />

      {/* ── Hero body ── */}
      <div className="relative w-full overflow-hidden">

        {/* Watermark — desktop only */}
        <div
          className="hidden md:flex absolute inset-0 items-center justify-end pointer-events-none select-none overflow-hidden"
          aria-hidden="true"
        >
          <span
            className="font-black leading-none tracking-tighter"
            style={{
              fontFamily: "var(--font-rubik)",
              color: "#F7CB46",
              opacity: 0.85,
              whiteSpace: "nowrap",
              fontSize: "clamp(100px, 18vw, 220px)",
              transform: "translateX(4%)",
            }}
          >
            SPENDS
          </span>
        </div>

        {/* ── DESKTOP (md+) ── */}
        <div className="hidden md:grid relative max-w-7xl mx-auto px-6 pt-14 pb-0 grid-cols-2 gap-8 items-end min-h-[520px]">

          {/* Left: copy + pill + CTA */}
          <motion.div
            className="flex flex-col gap-6 pb-20 z-10"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            {/* Headline */}
            <h1
              className="font-bold leading-[1.15] text-[#282825]"
              style={{
                fontFamily: "var(--font-jetbrains-mono)",
                fontSize: "clamp(32px, 4.5vw, 52px)",
              }}
            >
              {/* "Track" italic + red underline */}
              <span className="relative inline-block mr-2" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>
                Track your
              </span>

              {/* Animated pill */}
              <span className="inline-flex items-center relative" style={{ verticalAlign: "middle" }}>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={pillIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="inline-flex items-center gap-2 rounded-full"
                    style={{
                      backgroundColor: pill.color + "b3", // ~70% opacity
                      color: pill.text,
                      fontWeight: 800,
                      fontSize: pillFontSize(26, 3.8, 46, scale),
                      lineHeight: 1.2,
                      paddingTop: "2px",
                      paddingBottom: "4px",
                      paddingLeft: `${16 * scale}px`,
                      paddingRight: `${16 * scale}px`,
                    }}
                  >
                    {/* Blinking dot */}
                    <motion.span
                      className="inline-block rounded-full shrink-0"
                      style={{
                        width: "clamp(10px, 1.2vw, 24px)",
                        height: "clamp(10px, 1.2vw, 24px)",
                        backgroundColor: pill.dot,
                      }}
                      animate={{ opacity: [1, 0.15, 1] }}
                      transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
                    />
                    {pill.label}
                  </motion.span>
                </AnimatePresence>
              </span>
            </h1>

            {/* Second line */}
            <p
              className="font-bold text-[#282825] -mt-3"
              style={{
                fontFamily: "var(--font-jetbrains-mono)",
                fontSize: "clamp(32px, 4.5vw, 52px)",
                lineHeight: 1.15,
              }}
            >
              with intentional effort
            </p>

            <p
              className="text-[#282825] text-sm leading-relaxed max-w-[380px] opacity-75"
              style={{ fontFamily: "var(--font-jetbrains-mono)" }}
            >
              Yeah, yeah, we have AI features but you still need to input stuff yourself.
            </p>

            {/* CTA */}
            <motion.a
              href="#"
              whileHover={{ x: -2, y: -2, boxShadow: "6px 6px 0px #282825" }}
              whileTap={{ scale: 0.97, x: 0, y: 0 }}
              className="inline-block px-8 py-4 font-black text-lg w-fit cursor-pointer"
              style={{
                fontFamily: "var(--font-jetbrains-mono)",
                backgroundColor: "#F7CB46",
                color: "#282825",
                border: "3px solid #282825",
                boxShadow: "4px 4px 0px #282825",
                letterSpacing: "0.04em",
              }}
            >
              Get SPENDS
            </motion.a>
          </motion.div>

          {/* Right: phone image — cropped at bottom on desktop via overflow hidden */}
          <motion.div
            className="relative z-10 overflow-hidden"
            style={{ height: "480px" }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut", delay: 0.1 }}
          >
            <div className="relative w-full h-[580px]">
              <Image
                src="/first_page_image.png"
                alt="SPENDS app screens showing remaining funds, saving goals, and monthly expenses"
                fill
                className="object-contain object-bottom"
                priority
              />
            </div>
          </motion.div>
        </div>

        {/* ── MOBILE layout (below md) — correct reading order ── */}
        <div className="flex md:hidden flex-col items-center px-5 pt-10 pb-0 gap-0">

          {/* 1. Headline */}
          <motion.div
            className="flex flex-col gap-4 w-full z-10"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <h1
              className="font-bold leading-[1.3] text-[#282825] text-center"
              style={{
                fontFamily: "var(--font-jetbrains-mono)",
                fontSize: "clamp(24px, 6.5vw, 36px)",
              }}
            >
              <span className="relative inline-block mr-2">
                Track
              </span>
              your{" "}
              <AnimatePresence mode="wait">
                <motion.span
                  key={pillIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="inline-flex items-center gap-1.5 rounded-full"
                  style={{
                    backgroundColor: pill.color + "b3",
                    color: pill.text,
                    fontStyle: "italic",
                    paddingTop: "1px",
                    paddingBottom: "3px",
                    paddingLeft: `${12 * scale}px`,
                    paddingRight: `${12 * scale}px`,
                    fontSize: pillFontSize(22, 6, 34, scale),
                  }}
                >
                  <motion.span
                    className="inline-block rounded-full shrink-0"
                    style={{ width: 14, height: 14, backgroundColor: pill.dot }}
                    animate={{ opacity: [1, 0.15, 1] }}
                    transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
                  />
                  {pill.label}
                </motion.span>
              </AnimatePresence>
              <br />
              with intentional effort
            </h1>

            <p
              className="text-[#282825] text-xs leading-relaxed opacity-75 text-center"
              style={{ fontFamily: "var(--font-jetbrains-mono)" }}
            >
              Yeah, yeah, we have AI features but you still need to input stuff yourself.
            </p>
          </motion.div>

          {/* 2. Phone image — cropped at bottom like desktop, bigger */}
          <motion.div
            className="relative w-full z-10 mt-6 overflow-hidden"
            style={{ height: "380px" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut", delay: 0.1 }}
          >
            <div className="relative w-full h-[480px]">
              <Image
                src="/first_page_image.png"
                alt="SPENDS app screens"
                fill
                className="object-contain object-bottom"
                priority
              />
            </div>
          </motion.div>
        </div>
      </div>

      <TickerBanner />
    </section>
  );
}