"use client";

import { motion } from "motion/react";
import Navbar from "./Navbar";
import Link from "next/link";

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
      animate={{ 
        opacity: 1, 
        scale: 1,
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
      className="absolute border-[3px] border-black rounded-full px-5 py-2 font-black whitespace-nowrap z-0 hidden sm:block md:px-8 md:py-3"
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

export default function HeroSection() {
  return (
    <section className="flex flex-col min-h-screen relative overflow-hidden">
      {/* Background Gradient */}
      <div 
        className="absolute inset-0 z-0" 
        style={{ background: "linear-gradient(to bottom, #FF002C, #99001A)" }}
      />
      
      <div className="relative z-10 flex flex-col flex-1">
        <Navbar />

        {/* Hero Content */}
        <div className="flex-1 flex items-center justify-center relative w-full max-w-7xl mx-auto px-4 sm:px-6 pb-20">
          
          {/* Floating Pills (Desktop & Tablet) */}
          <FloatingPill
            label="TRACK SAVING"
            bg="#ccff00"
            text="#000"
            top="15%"
            left="5%"
            rotate={-12}
            delay={0.1}
          />
          <FloatingPill
            label="TRACK FUNDS"
            bg="#00E573"
            text="#000"
            top="20%"
            right="5%"
            rotate={15}
            delay={0.3}
          />
          <FloatingPill
            label="TRACK EXPENSES"
            bg="#ffffff"
            text="#000"
            bottom="20%"
            left="8%"
            rotate={10}
            delay={0.5}
          />
          <FloatingPill
            label="REACH GOALS"
            bg="#ccff00"
            text="#000"
            bottom="15%"
            right="10%"
            rotate={-15}
            delay={0.7}
          />

          <motion.div 
            className="flex flex-col items-center z-20 w-full max-w-3xl px-4 mt-8 md:mt-0"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            
            {/* Top Icons */}
            <div className="flex items-center gap-6 mb-8">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-[#FFC600] rounded-full border-[3px] border-black flex items-center justify-center" style={{ boxShadow: "3px 3px 0px 0px #000" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" color="#000">
                  <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
                  <circle cx="12" cy="13" r="3"></circle>
                </svg>
              </div>
              <div className="w-14 h-14 md:w-16 md:h-16 bg-[#D9313F] rounded-full border-[3px] border-black flex items-center justify-center" style={{ boxShadow: "3px 3px 0px 0px #000" }}>
                <div className="w-5 h-5 bg-[#7B0D1E] rounded-sm" />
              </div>
            </div>

            {/* Button */}
            <Link 
              href="/download"
              className="group relative inline-flex items-center justify-center cursor-pointer w-full sm:w-auto"
            >
              <div className="absolute inset-0 bg-black translate-x-2 translate-y-2 md:translate-x-3 md:translate-y-3" />
              <div 
                className="relative border-[3px] md:border-4 border-black px-12 py-5 md:px-20 md:py-8 flex items-center justify-center transition-transform active:translate-y-1 active:translate-x-1 md:active:translate-y-2 md:active:translate-x-2 w-full sm:w-auto"
                style={{ backgroundColor: "#FFC600" }}
              >
                <span 
                  className="text-black font-black text-5xl sm:text-6xl md:text-7xl lg:text-[80px] tracking-tight uppercase"
                  style={{ fontFamily: "var(--font-rubik)" }}
                >
                  Spends
                </span>
              </div>
            </Link>

            {/* Tagline */}
            <h2 
              className="mt-14 md:mt-20 text-white text-3xl sm:text-4xl md:text-[44px] text-center leading-tight font-medium"
              style={{ fontFamily: "var(--font-jetbrains-mono)" }}
            >
              Stop guessing where{" "}
              <span className="relative inline-block">
                your
                <span className="absolute left-0 bottom-[-2px] md:bottom-[-4px] w-full h-[3px] md:h-[4px] bg-[#FFC600]" />
              </span>{" "}
              <br className="hidden sm:block" />
              money <span style={{ color: "#ccff00" }}>actually goes.</span>
            </h2>

          </motion.div>
        </div>
      </div>
    </section>
  );
}