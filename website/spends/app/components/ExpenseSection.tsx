"use client";

import { motion } from "motion/react";
import Image from "next/image";

const pills = [
  { label: "Voice Input", color: "#F7CB46", text: "#282825" },
  { label: "Camera Scan", color: "#A8FF57", text: "#282825" },
  { label: "AI Categorise", color: "#D9313F", text: "#ffffff" },
  { label: "Bulk Add", color: "#00215E", text: "#ffffff" },
  { label: "Edit Before Save", color: "#DE1A58", text: "#ffffff" },
];

export default function ExpenseSection() {
  return (
    <section
      id="expense-tracking"
      className="w-full pb-20 md:pb-28 overflow-hidden relative"
      style={{ backgroundColor: "#F9F5F2" }}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* ── MOBILE (below md) ── */}
        <div className="flex md:hidden flex-col items-center text-center pt-14">
          {/* Image in slightly darker block — pill sits on top edge */}
          <motion.div
            className="w-full rounded-lg relative mb-6"
            style={{ backgroundColor: "#EDE8E4" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {/* Pill overlapping the top edge */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-10">
              <span
                className="inline-block px-4 py-1.5 text-xs font-black tracking-widest uppercase border-2 border-[#282825] whitespace-nowrap"
                style={{
                  fontFamily: "var(--font-jetbrains-mono)",
                  backgroundColor: "#D9313F",
                  color: "#fff",
                  boxShadow: "3px 3px 0px #282825",
                }}
              >
                Expense Tracking
              </span>
            </div>

            {/* Image — no top padding, flush to box top */}
            <div className="relative w-full aspect-[3/4] max-w-[320px] mx-auto px-4 pb-4">
              <Image
                src="/expense_mobile_new.png"
                alt="SPENDS expense input screen"
                fill
                className="object-contain object-top"
                quality={100}
              />
            </div>
          </motion.div>

          {/* 5 pills */}
          <motion.div
            className="flex flex-wrap justify-center gap-2 mb-5"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {pills.map((pill, i) => (
              <span
                key={pill.label}
                className="px-3 py-1 text-[10px] font-black tracking-wide border-2 border-[#282825] cursor-default"
                style={{
                  fontFamily: "var(--font-jetbrains-mono)",
                  backgroundColor: pill.color,
                  color: pill.text,
                  boxShadow: "2px 2px 0px #282825",
                }}
              >
                {pill.label}
              </span>
            ))}
          </motion.div>

          {/* Heading */}
          <h2
            className="font-bold leading-[1.2] text-[#282825] mb-4"
            style={{
              fontFamily: "var(--font-jetbrains-mono)",
              fontSize: "clamp(22px, 6vw, 32px)",
            }}
          >
            Say it, snap it, <span style={{ color: "#D9313F" }}>done.</span>
          </h2>

          {/* Body text */}
          <div
            className="flex flex-col gap-3 text-[#282825] max-w-[420px]"
            style={{ fontFamily: "var(--font-jetbrains-mono)" }}
          >
            <p className="text-xs leading-relaxed opacity-80">
              The usual way still works — pick a category, type the amount,
              save. Boring but reliable.
            </p>
            <p className="text-xs leading-relaxed opacity-80">
              <span className="font-black opacity-100">The fun way:</span> just
              talk. &quot;Football $50, cinema $20, groceries $80&quot; — AI
              hears it, sorts it into categories, hands you an editable list.
              One tap to save the whole thing.
            </p>
            <p className="text-xs leading-relaxed opacity-80">
              Or point your camera at a receipt. AI reads it so you don&apos;t
              have to squint at the numbers yourself.
            </p>
          </div>
        </div>

        {/* ── DESKTOP / TABLET (md+) ── */}
        <div className="hidden md:block">
          {/* Section label */}
          <div className="pt-28 lg:pt-10 mb-10 lg:mb-14">
            <span
              className="inline-block px-4 py-1.5 text-xs font-black tracking-widest uppercase border-2 border-[#282825]"
              style={{
                fontFamily: "var(--font-jetbrains-mono)",
                backgroundColor: "#D9313F",
                color: "#fff",
                boxShadow: "3px 3px 0px #282825",
              }}
            >
              Expense Tracking
            </span>
          </div>

          <div className="grid grid-cols-2 gap-8 lg:gap-16 items-start">
            {/* Left: copy + pills */}
            <motion.div
              className="flex flex-col gap-4 lg:gap-6 pt-4 lg:pt-6"
              initial={{ opacity: 0, x: -32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="flex flex-wrap gap-2 lg:gap-3">
                {pills.map((pill, i) => (
                  <motion.span
                    key={pill.label}
                    className="px-3 py-1 lg:px-4 lg:py-1.5 text-[10px] lg:text-xs font-black tracking-wide border-2 border-[#282825] cursor-default"
                    style={{
                      fontFamily: "var(--font-jetbrains-mono)",
                      backgroundColor: pill.color,
                      color: pill.text,
                      boxShadow: "2px 2px 0px #282825",
                    }}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: 0.05 * i }}
                    whileHover={{ y: -2, boxShadow: "3px 3px 0px #282825" }}
                  >
                    {pill.label}
                  </motion.span>
                ))}
              </div>

              <h2
                className="font-bold leading-[1.2] text-[#282825]"
                style={{
                  fontFamily: "var(--font-jetbrains-mono)",
                  fontSize: "clamp(20px, 3.5vw, 42px)",
                }}
              >
                Say it, snap it, <span style={{ color: "#D9313F" }}>done.</span>
              </h2>

              <div
                className="flex flex-col gap-3 lg:gap-4 text-[#282825]"
                style={{ fontFamily: "var(--font-jetbrains-mono)" }}
              >
                <p className="text-xs lg:text-sm leading-relaxed opacity-80">
                  The usual way still works — pick a category, type the amount,
                  save. Boring but reliable.
                </p>
                <p className="text-xs lg:text-sm leading-relaxed opacity-80">
                  <span className="font-black opacity-100">The fun way:</span>{" "}
                  just talk. &quot;Football $50, cinema $20, groceries $80&quot;
                  — AI hears it, sorts it into categories, hands you an editable
                  list. One tap to save the whole thing.
                </p>
                <p className="text-xs lg:text-sm leading-relaxed opacity-80">
                  Or point your camera at a receipt. AI reads it so you
                  don&apos;t have to squint at the numbers yourself.
                </p>
              </div>

              <div
                className="w-12 h-1 border border-[#282825]"
                style={{ backgroundColor: "#F7CB46" }}
              />
            </motion.div>

            {/* Right: image, absolutely positioned to start at the top edge */}
            <motion.div
              className="absolute top-0 right-0 w-1/2 flex justify-center"
              initial={{ opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            >
              <div className="relative w-full max-w-[380px] lg:max-w-[550px] h-[550px] lg:h-[750px]">
                <Image
                  src="/second_page_web.png"
                  alt="SPENDS expense input screen with AI voice and camera features"
                  fill
                  className="object-contain object-top"
                  quality={100}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
