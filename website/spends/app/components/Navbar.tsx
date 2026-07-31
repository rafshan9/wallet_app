"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import GetSpendsButton from "./GetSpendsButton";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = ["Features", "Pricing", "Download"];

  return (
    <nav
      className="w-full border-b-2 border-[#282825]"
      style={{ backgroundColor: "#D9313F" }}
    >
      <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">
        {/* Logo */}
        <span
          className="text-2xl font-black tracking-tight text-[#F7CB46]"
          style={{ fontFamily: "var(--font-rubik)" }}
        >
          SPENDS
        </span>

        {/* Desktop Nav */}
        <ul
          className="hidden md:flex items-center gap-8"
          style={{ fontFamily: "var(--font-jetbrains-mono)" }}
        >
          {navLinks.map((link) => (
            <li key={link}>
              <a
                href="#"
                className="text-white font-semibold text-sm tracking-wide hover:text-[#F7CB46] transition-colors duration-150"
              >
                {link}
              </a>
            </li>
          ))}
          <li>
            <GetSpendsButton />
          </li>
        </ul>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-1"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-6 h-0.5 bg-white transition-transform duration-200 ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
          />
          <span
            className={`block w-6 h-0.5 bg-white transition-opacity duration-200 ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block w-6 h-0.5 bg-white transition-transform duration-200 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-t-2 border-[#282825] md:hidden"
          >
            <ul
              className="flex flex-col px-6 py-4 gap-4"
              style={{ fontFamily: "var(--font-jetbrains-mono)" }}
            >
              {navLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-white font-semibold text-base tracking-wide hover:text-[#F7CB46] transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#"
                  className="inline-block px-5 py-2.5 bg-[#F7CB46] text-[#282825] font-black text-sm border-2 border-[#282825]"
                  style={{ boxShadow: "3px 3px 0px #282825" }}
                >
                  Get SPENDS
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
