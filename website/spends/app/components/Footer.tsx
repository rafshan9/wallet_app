"use client";

import { motion } from "motion/react";

const footerLinks = {
  Product: ["Features", "Pricing", "Download", "Changelog"],
  Support: ["FAQ", "Contact", "Privacy Policy", "Terms of Use"],
  Connect: ["Twitter / X", "Instagram", "GitHub", "Press Kit"],
};

export default function Footer() {
  return (
    <footer
      className="w-full border-t-4 border-[#282825]"
      style={{ backgroundColor: "#D9313F" }}
    >
      {/* Top CTA strip */}
      <div className="border-b-[3px] border-[#282825] px-8 md:px-12 py-14 md:py-16 flex flex-col md:flex-row items-start md:items-end justify-between gap-8 flex-wrap">
        <div className="flex flex-col gap-0">
          <p
            className="text-[11px] font-black tracking-[0.18em] uppercase mb-3"
            style={{ fontFamily: "var(--font-jetbrains-mono)", color: "#F7CB46", opacity: 0.65 }}
          >
            Ready when you are
          </p>
          <h2
            className="font-bold leading-[1.1] text-[#F9F5F2]"
            style={{
              fontFamily: "var(--font-jetbrains-mono)",
              fontSize: "clamp(26px, 4vw, 46px)",
            }}
          >
            Stop guessing where
            <br />
            your money{" "}
            <span style={{ color: "#F7CB46" }}>actually goes.</span>
          </h2>
          <div className="w-12 h-1 mt-5" style={{ backgroundColor: "#F7CB46" }} />
        </div>

        <motion.a
          href="#"
          whileHover={{ x: -3, y: -3, boxShadow: "8px 8px 0px #282825" }}
          whileTap={{ scale: 0.97, x: 0, y: 0 }}
          className="shrink-0 inline-block px-9 py-5 font-black text-lg cursor-pointer"
          style={{
            fontFamily: "var(--font-jetbrains-mono)",
            backgroundColor: "#F7CB46",
            color: "#282825",
            border: "3px solid #282825",
            boxShadow: "5px 5px 0px #282825",
            letterSpacing: "0.04em",
          }}
        >
          Get SPENDS
        </motion.a>
      </div>

      {/* Main grid */}
      <div
        className="px-8 md:px-12 py-12 border-b-2"
        style={{ borderColor: "rgba(40,40,37,0.25)" }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 flex flex-col gap-0">
            <span
              className="text-[28px] font-black tracking-tight mb-3"
              style={{ fontFamily: "var(--font-rubik)", color: "#F7CB46" }}
            >
              SPENDS
            </span>
            <p
              className="text-xs leading-relaxed max-w-[220px]"
              style={{
                fontFamily: "var(--font-jetbrains-mono)",
                color: "#F9F5F2",
                opacity: 0.6,
              }}
            >
              Track your money with intentional effort. No bank connections. No data selling.
              Just you and your numbers.
            </p>
            <div className="flex gap-3 mt-5 flex-wrap">
              {["iOS", "Android"].map((p) => (
                <span
                  key={p}
                  className="px-3.5 py-1.5 text-[11px] font-black border-2 cursor-pointer transition-colors duration-150 hover:bg-[#F7CB46] hover:text-[#282825]"
                  style={{
                    fontFamily: "var(--font-jetbrains-mono)",
                    borderColor: "#F7CB46",
                    color: "#F7CB46",
                    letterSpacing: "0.06em",
                  }}
                >
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="flex flex-col gap-0">
              <p
                className="text-[10px] font-black tracking-[0.2em] uppercase mb-4"
                style={{
                  fontFamily: "var(--font-jetbrains-mono)",
                  color: "#F7CB46",
                  opacity: 0.65,
                }}
              >
                {category}
              </p>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-[13px] transition-all duration-150"
                      style={{
                        fontFamily: "var(--font-jetbrains-mono)",
                        color: "#F9F5F2",
                        opacity: 0.55,
                        textDecoration: "none",
                      }}
                      onMouseEnter={(e) => {
                        (e.target as HTMLAnchorElement).style.opacity = "1";
                        (e.target as HTMLAnchorElement).style.color = "#F7CB46";
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLAnchorElement).style.opacity = "0.55";
                        (e.target as HTMLAnchorElement).style.color = "#F9F5F2";
                      }}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="px-8 md:px-12 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 flex-wrap">
        <p
          className="text-[11px]"
          style={{ fontFamily: "var(--font-jetbrains-mono)", color: "#F9F5F2", opacity: 0.3 }}
        >
          © {new Date().getFullYear()} SPENDS. All rights reserved.
        </p>
        <p
          className="text-[11px]"
          style={{ fontFamily: "var(--font-jetbrains-mono)", color: "#F9F5F2", opacity: 0.3 }}
        >
          Made with intentional effort.
        </p>
        <div className="flex gap-3">
          {[
            { label: "Twitter", icon: "𝕏" },
            { label: "Instagram", icon: "◎" },
            { label: "GitHub", icon: "◉" },
          ].map((s) => (
            <a
              key={s.label}
              href="#"
              aria-label={s.label}
              className="w-9 h-9 flex items-center justify-center text-sm border-2 transition-all duration-150"
              style={{
                borderColor: "rgba(249,245,242,0.25)",
                color: "#F9F5F2",
                opacity: 0.5,
                fontFamily: "var(--font-jetbrains-mono)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.opacity = "1";
                el.style.borderColor = "#F7CB46";
                el.style.color = "#F7CB46";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.opacity = "0.5";
                el.style.borderColor = "rgba(249,245,242,0.25)";
                el.style.color = "#F9F5F2";
              }}
            >
              {s.icon}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
