"use client";

import React from "react";
import { motion, useInView } from "motion/react";
import Image from "next/image";

const pills = [
  { label: "Set a Goal", color: "#A8FF57", text: "#282825" },
  { label: "Log Deposits", color: "#282825", text: "#A8FF57" },
  { label: "Track Progress", color: "#F7CB46", text: "#282825" },
  { label: "Multiple Goals", color: "#00215E", text: "#ffffff" },
];

// Animated progress bar for visual flair
function ProgressBar({
  label,
  percent,
  color,
  delay,
}: {
  label: string;
  percent: number;
  color: string;
  delay: number;
}) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div className="flex flex-col gap-1.5" ref={ref}>
      <div className="flex justify-between items-center">
        <span
          className="text-[10px] sm:text-xs font-bold text-[#282825] opacity-80"
          style={{ fontFamily: "var(--font-jetbrains-mono)" }}
        >
          {label}
        </span>
        <span
          className="text-[10px] sm:text-xs font-black text-[#282825]"
          style={{ fontFamily: "var(--font-jetbrains-mono)" }}
        >
          {percent}%
        </span>
      </div>
      <div
        className="w-full h-2.5 sm:h-3 border-2 border-[#282825] bg-white overflow-hidden"
      >
        <motion.div
          className="h-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={isInView ? { width: `${percent}%` } : { width: 0 }}
          transition={{ duration: 2.5, ease: "easeOut", delay }}
        />
      </div>
    </div>
  );
}

export default function GoalsSection() {
  return (
    <section
      className="w-full pt-20 md:pt-28 overflow-hidden border-t-4 border-[#282825] relative"
      style={{ backgroundColor: "#ffffffff" }}
    >
      <div className="max-w-7xl mx-auto px-6">

        {/* ── MOBILE (below md) ── */}
        <div className="flex md:hidden flex-col items-center text-center pb-14">

          {/* Image in slightly darker block — pill sits on top edge */}
          <motion.div
            className="w-full rounded-lg relative mb-6"
            style={{ backgroundColor: "#F2F2F2" }}
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
                  backgroundColor: "#A8FF57",
                  color: "#282825",
                  boxShadow: "3px 3px 0px #282825",
                }}
              >
                Savings Goals
              </span>
            </div>

            {/* Image — no bottom padding, flush to box bottom */}
            <div className="relative w-full aspect-[3/4] max-w-[320px] mx-auto pt-4 px-4">
              <Image
                src="/goal_mobile_new.png"
                alt="SPENDS goals screen showing savings progress"
                fill
                className="object-contain object-bottom"
                quality={100}
              />
            </div>
          </motion.div>

          {/* 4 pills */}
          <motion.div
            className="flex flex-wrap justify-center gap-2 mb-5"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {pills.map((pill) => (
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
            That Bali trip isn&apos;t going to fund itself.
          </h2>

          {/* Body text */}
          <div
            className="flex flex-col gap-3 text-[#282825] max-w-[420px] mb-6"
            style={{ fontFamily: "var(--font-jetbrains-mono)" }}
          >
            <p className="text-xs leading-relaxed opacity-80">
              Name your goal. Set a target. Every time you put money aside,
              log it. That&apos;s it.
            </p>
            <p className="text-xs leading-relaxed opacity-80">
              Run multiple goals at once — holiday, new laptop, emergency
              fund, whatever. Watch the bars creep forward and feel
              unreasonably good about yourself.
            </p>
          </div>

          {/* Your goals progress bars block */}
          <div
            className="w-full max-w-[420px] flex flex-col gap-3 p-4 border-2 border-[#282825]"
            style={{
              backgroundColor: "#fff",
              boxShadow: "4px 4px 0px #282825",
            }}
          >
            <p
              className="text-[10px] font-black tracking-widest uppercase opacity-50 text-[#282825]"
              style={{ fontFamily: "var(--font-jetbrains-mono)" }}
            >
              Your goals
            </p>
            <ProgressBar label="Trip to Bali" percent={42} color="#A8FF57" delay={0.1} />
            <ProgressBar label="New Laptop" percent={68} color="#F7CB46" delay={0.25} />
            <ProgressBar label="Emergency Fund" percent={25} color="#D9313F" delay={0.4} />
          </div>
        </div>

        {/* ── DESKTOP / TABLET (md+) ── */}
        <div className="hidden md:block">
          {/* Section label */}
          <div className="mb-10 md:mb-14">
            <span
              className="inline-block px-4 py-1.5 text-xs font-black tracking-widest uppercase border-2 border-[#282825]"
              style={{
                fontFamily: "var(--font-jetbrains-mono)",
                backgroundColor: "#A8FF57",
                color: "#282825",
                boxShadow: "3px 3px 0px #282825",
              }}
            >
              Savings Goals
            </span>
          </div>

          {/* Grid: copy left, image right */}
          <div className="grid grid-cols-2 gap-8 lg:gap-16 items-start pb-20 md:pb-28">

            {/* Left: copy + pills + progress bars */}
            <motion.div
              className="flex flex-col gap-4 lg:gap-6"
              initial={{ opacity: 0, x: -32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {/* Pills */}
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

              {/* Headline */}
              <h2
                className="font-bold leading-[1.2] text-[#282825]"
                style={{
                  fontFamily: "var(--font-jetbrains-mono)",
                  fontSize: "clamp(20px, 3.5vw, 42px)",
                }}
              >
                That Bali trip{" "}
                isn&apos;t going to fund itself.
              </h2>

              {/* Body copy */}
              <div
                className="flex flex-col gap-3 lg:gap-4 text-[#282825]"
                style={{ fontFamily: "var(--font-jetbrains-mono)" }}
              >
                <p className="text-xs lg:text-sm leading-relaxed opacity-80">
                  Name your goal. Set a target. Every time you put money aside,
                  log it. That&apos;s it.
                </p>
                <p className="text-xs lg:text-sm leading-relaxed opacity-80">
                  Run multiple goals at once — holiday, new laptop, emergency
                  fund, whatever. Watch the bars creep forward and feel
                  unreasonably good about yourself.
                </p>
              </div>

              {/* Animated progress bars — visual demo */}
              <div
                className="flex flex-col gap-3 lg:gap-4 p-3 lg:p-5 border-2 border-[#282825]"
                style={{
                  backgroundColor: "#fff",
                  boxShadow: "4px 4px 0px #282825",
                }}
              >
                <p
                  className="text-[10px] lg:text-xs font-black tracking-widest uppercase opacity-50 text-[#282825]"
                  style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                >
                  Your goals
                </p>
                <ProgressBar label="Trip to Bali" percent={42} color="#A8FF57" delay={0.1} />
                <ProgressBar label="New Laptop" percent={68} color="#F7CB46" delay={0.25} />
                <ProgressBar label="Emergency Fund" percent={25} color="#D9313F" delay={0.4} />
              </div>

              {/* Divider detail */}
              <div
                className="w-12 h-1 border border-[#282825]"
                style={{ backgroundColor: "#A8FF57" }}
              />
            </motion.div>

            {/* Right: phone image, pinned to the bottom edge of the section */}
            <motion.div
              className="flex absolute bottom-0 right-0 w-1/2 justify-center"
              initial={{ opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            >
              <div className="relative w-full max-w-[380px] lg:max-w-[550px] h-[550px] lg:h-[750px]">
                <Image
                  src="/third_page_web.png"
                  alt="SPENDS goals screen showing savings progress"
                  fill
                  className="object-contain object-bottom"
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
