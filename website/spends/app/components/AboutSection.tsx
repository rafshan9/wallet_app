"use client";

import { motion } from "motion/react";
import Image from "next/image";

const pills = [
  { label: "No bank links", color: "#282825", text: "#A8FF57" },
  { label: "Your data stays yours", color: "#00215E", text: "#ffffff" },
  { label: "Expense tracking", color: "#D9313F", text: "#ffffff" },
  { label: "Savings goals", color: "#A8FF57", text: "#282825" },
  { label: "Pending payments", color: "#F7CB46", text: "#282825" },
  { label: "IOUs & notes", color: "#DE1A58", text: "#ffffff" },
];

const features = [
  {
    icon: "/camera.svg",
    title: "Track expenses",
    desc: "Manual, voice, or camera. Log one thing or a whole shopping haul at once. AI sorts the categories so you don't have to.",
  },
  {
    icon: "/goal.svg",
    title: "Save for things",
    desc: "Name a goal, set a number, chip away at it. Holiday, gadget, emergency fund — run them all at once and watch the bars move.",
  },
  {
    icon: "/payment.svg",
    title: "Pending payments",
    desc: "Rent, subscriptions, that gym you keep forgetting to cancel — log recurring or one-time payments so nothing sneaks up on you.",
  },
  {
    icon: "/notes.svg",
    title: "IOUs & notes",
    desc: "Lent someone $40? Someone owes you for dinner? Write it down before you forget who owes who what.",
  },
];

export default function AboutSection() {
  return (
    <section
      className="w-full py-20 md:py-28 overflow-hidden border-t-4 border-[#282825]"
      style={{ backgroundColor: "#F9F5F2" }}
    >
      <div className="max-w-7xl mx-auto px-6">

        {/* Top: headline + pills side by side on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start mb-16 md:mb-20">

          {/* Left: headline */}
          <motion.div
            className="flex flex-col gap-5"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            <h2
              className="font-bold leading-[1.15] text-[#282825]"
              style={{
                fontFamily: "var(--font-jetbrains-mono)",
                fontSize: "clamp(30px, 4vw, 52px)",
              }}
            >
              A little about why{" "}
              <span className="relative inline-block">
                this exists
                <span
                  className="absolute left-0 -bottom-1 w-full h-[3px]"
                  style={{ backgroundColor: "#D9313F" }}
                />
              </span>
            </h2>

            <p
              className="text-sm leading-relaxed text-[#282825] opacity-75 max-w-[420px]"
              style={{ fontFamily: "var(--font-jetbrains-mono)" }}
            >
              Most expense apps want to connect to your bank, read your
              statements, and know everything about you. SPENDS doesn&apos;t.
              You type it in yourself — on purpose — because that two-second
              friction is actually the point. You notice what you spend when
              you have to say it out loud.
            </p>

            <p
              className="text-sm leading-relaxed text-[#282825] opacity-75 max-w-[420px]"
              style={{ fontFamily: "var(--font-jetbrains-mono)" }}
            >
              Your financial apps are completely untouched. No tokens, no
              read access, no data entangled with ours. Just you, a few taps,
              and a clearer picture of where your money went.
            </p>
          </motion.div>

          {/* Right: pills */}
          <motion.div
            className="flex flex-col gap-5 justify-start pt-1"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, ease: "easeOut", delay: 0.1 }}
          >
            <p
              className="text-xs font-black tracking-widest uppercase opacity-50 text-[#282825]"
              style={{ fontFamily: "var(--font-jetbrains-mono)" }}
            >
              What&apos;s inside
            </p>
            <div className="flex flex-wrap gap-3">
              {pills.map((pill, i) => (
                <motion.span
                  key={pill.label}
                  className="px-4 py-2 text-xs font-black tracking-wide border-2 border-[#282825] cursor-default"
                  style={{
                    fontFamily: "var(--font-jetbrains-mono)",
                    backgroundColor: pill.color,
                    color: pill.text,
                    boxShadow: "2px 2px 0px #282825",
                  }}
                  initial={{ opacity: 0, scale: 0.92 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.06 * i }}
                  whileHover={{ y: -2, boxShadow: "3px 3px 0px #282825" }}
                >
                  {pill.label}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="w-full h-[2px] bg-[#282825] opacity-10 mb-16" />

        {/* Feature cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="flex flex-col gap-4 p-6 border-2 border-[#282825]"
              style={{
                backgroundColor: "#fff",
                boxShadow: "4px 4px 0px #282825",
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.08 * i }}
              whileHover={{
                y: -3,
                boxShadow: "6px 6px 0px #282825",
                transition: { duration: 0.15 },
              }}
            >
              <motion.div
                animate={{ rotate: [0, -6, 6, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5 * i,
                }}
              >
                <Image
                  src={f.icon}
                  alt={f.title}
                  width={28}
                  height={28}
                />
              </motion.div>
              <h3
                className="font-black text-[#282825] text-sm tracking-wide"
                style={{ fontFamily: "var(--font-jetbrains-mono)" }}
              >
                {f.title}
              </h3>
              <p
                className="text-xs leading-relaxed text-[#282825] opacity-70"
                style={{ fontFamily: "var(--font-jetbrains-mono)" }}
              >
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
