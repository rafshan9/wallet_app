"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";

const FloatingPill = ({
  label,
  bg,
  text,
  top,
  left,
  right,
  bottom,
  rotate,
  delay
}: {
  label: string;
  bg: string;
  text: string;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  rotate: number;
  delay: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      animate={{
        y: [0, -15, 0],
        x: [0, 10, 0],
        rotate: [rotate, rotate + 4, rotate - 3, rotate]
      }}
      transition={{
        opacity: { duration: 0.5, delay },
        scale: { duration: 0.5, delay },
        y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay },
        x: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: delay + 1 },
        rotate: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: delay + 2 }
      }}
      className="absolute border-[3px] border-black rounded-full px-4 py-1.5 font-black whitespace-nowrap z-0 md:px-8 md:py-3 block"
      style={{
        backgroundColor: bg,
        color: text,
        top,
        left,
        right,
        bottom,
        boxShadow: "4px 4px 0px 0px #000",
        fontFamily: "var(--font-jetbrains-mono)",
        fontSize: "clamp(12px, 1.5vw, 20px)",
      }}
    >
      {label}
    </motion.div>
  );
};

// Conditional per-screen positioning for mobile — tight to logo, edge-to-edge fan
const getMobileStyle = (index: number) => {
  switch (index) {
    case 0: return { left: "15%", bottom: "-140px", zIndex: 10, scale: 0, rotate: -20 };
    case 1: return { left: "15%", bottom: "-130px", zIndex: 20, scale: 0.86, rotate: -11 };
    case 2: return { left: "34%", bottom: "-120px", zIndex: 40, scale: 1, rotate: -4 };
    case 3: return { left: "55%", bottom: "-90px", zIndex: 40, scale: 1, rotate: 4 };
    case 4: return { left: "75%", bottom: "-110px", zIndex: 20, scale: 0.86, rotate: 11 };
    case 5: return { left: "88%", bottom: "-140px", zIndex: 10, scale: 0.72, rotate: 20 };
    default: return { left: "50%", bottom: "-140px", zIndex: 10, scale: 1, rotate: 0 };
  }
};

export default function ScreensSection() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const screens = [
    "/assets_for_new_ui/image_1.png",
    "/assets_for_new_ui/image_2.png",
    "/assets_for_new_ui/image_3.png",
    "/assets_for_new_ui/image_4.png",
    "/assets_for_new_ui/image_5.png",
    "/assets_for_new_ui/image_6.png",
  ];

  return (
    <section className="relative w-full overflow-hidden pt-16 pb-16 md:pt-24 md:pb-0 flex flex-col items-center" style={{ backgroundColor: "#FF002C" }}>

      {/* Floating Pills */}
      <FloatingPill
        label="TRACK SAVING"
        bg="#ccff00"
        text="#000"
        top="8%"
        left="5%"
        rotate={-12}
        delay={0.1}
      />
      <FloatingPill
        label="TRACK FUNDS"
        bg="#00E573"
        text="#000"
        top="12%"
        right="2%"
        rotate={15}
        delay={0.3}
      />
      <FloatingPill
        label="TRACK EXPENSES"
        bg="#ffffff"
        text="#000"
        top="45%"
        left="8%"
        rotate={10}
        delay={0.5}
      />
      <FloatingPill
        label="REACH GOALS"
        bg="#ccff00"
        text="#000"
        top="45%"
        right="8%"
        rotate={-15}
        delay={0.7}
      />

      {/* Main Logo Text */}
      <motion.div
        className="relative z-10 w-full max-w-6xl mx-auto px-4 mt-8 flex justify-center mb-2 md:mb-24"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <Image
          src="/assets_for_new_ui/spends_logo.svg"
          alt="SPENDS"
          width={900}
          height={223}
          className="w-full h-auto"
        />
      </motion.div>

      {/* Screens Display */}
      <div className="relative z-20 w-full flex justify-center items-end" style={{ height: isMobile ? "300px" : "auto" }}>
        {isMobile ? (
          // Mobile Fan Layout — full width, no max-w constraint, bleeds to edges
          <div className="relative w-full h-[300px]">
            {screens.map((src, idx) => {
              const s = getMobileStyle(idx);
              return (
                <motion.div
                  key={idx}
                  className="absolute w-[140px]"
                  style={{ left: s.left, bottom: s.bottom, zIndex: s.zIndex }}
                  initial={{ opacity: 0, y: 30, x: "-50%", rotate: s.rotate, scale: s.scale }}
                  whileInView={{ opacity: 1, y: 0, x: "-50%", rotate: s.rotate, scale: s.scale }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.08 }}
                >
                  <Image
                    src={src}
                    alt={`App Screen ${idx + 1}`}
                    width={400}
                    height={800}
                    className="w-full h-auto drop-shadow-2xl"
                  />
                </motion.div>
              );
            })}
          </div>
        ) : (
          // Desktop Linear Layout — unchanged
          <div className="flex flex-row justify-center items-end w-full px-4" style={{ gap: "-20px" }}>
            {screens.map((src, idx) => (
              <motion.div
                key={idx}
                className="relative z-20 w-[18%] transition-transform hover:-translate-y-4 hover:z-30 duration-300"
                style={{ marginLeft: idx === 0 ? "0" : "-2%" }}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <Image
                  src={src}
                  alt={`App Screen ${idx + 1}`}
                  width={500}
                  height={1000}
                  className="w-full h-auto drop-shadow-2xl translate-y-[2%]"
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

    </section>
  );
}