"use client";

import { motion } from "motion/react";
import Image from "next/image";

const tickerItems = [
  { icon: "/phone.svg", text: "GET THE APP" },
  { icon: "/camera.svg", text: "TRACK YOUR SPENDS" },
  { icon: "/goal.svg", text: "HIT YOUR GOALS" },
  { icon: "/bar.svg", text: "VISUALIZE SPENDING" },
  { icon: "/phone.svg", text: "GET THE APP" },
  { icon: "/camera.svg", text: "TRACK YOUR SPENDS" },
  { icon: "/goal.svg", text: "HIT YOUR GOALS" },
  { icon: "/bar.svg", text: "VISUALIZE SPENDING" },
];

export default function TickerBanner() {
  return (
    <div
      className="w-full overflow-hidden border-y-2 border-[#282825] py-1.5"
      style={{ backgroundColor: "#F7CB46" }}
    >
      <motion.div
        className="flex gap-12 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration: 18,
          ease: "linear",
          repeat: Infinity,
        }}
        style={{ width: "max-content" }}
      >
        {tickerItems.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-2 text-[#282825] font-black text-sm tracking-widest"
            style={{ fontFamily: "var(--font-jetbrains-mono)" }}
          >
            <Image
              src={item.icon}
              alt=""
              width={16}
              height={16}
              className="inline-block"
              style={{ filter: "brightness(0)" }}
            />
            {item.text}
            <span className="ml-8 text-[#282825] opacity-40">◆</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
