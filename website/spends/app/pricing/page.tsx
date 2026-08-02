import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function PricingPage() {
  return (
    <main
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#F9F5F2" }}
    >
      <Navbar />

      <section className="flex-grow flex flex-col items-center justify-center px-6 py-20">
        <div
          className="max-w-2xl w-full border-[3px] border-[#282825] p-8 md:p-12 text-center"
          style={{
            backgroundColor: "#A8FF57",
            boxShadow: "8px 8px 0px #282825",
          }}
        >
          <div
            className="inline-block px-4 py-1.5 mb-6 text-xs font-black tracking-widest uppercase border-2 border-[#282825]"
            style={{
              fontFamily: "var(--font-jetbrains-mono)",
              backgroundColor: "#D9313F",
              color: "#fff",
              boxShadow: "3px 3px 0px #282825",
            }}
          >
            Beta Phase
          </div>

          <h1
            className="font-bold text-[#282825] mb-6 leading-tight"
            style={{
              fontFamily: "var(--font-jetbrains-mono)",
              fontSize: "clamp(32px, 5vw, 48px)",
            }}
          >
            Pricing? We&apos;re not there yet.
          </h1>

          <p
            className="text-[#282825] text-base md:text-lg mb-10 leading-relaxed font-medium"
            style={{ fontFamily: "var(--font-jetbrains-mono)" }}
          >
            The app is still in beta, so pricing hasn&apos;t been decided. I
            want to build something you actually love using. <br />
            <br />
            Let me know how much you think it should cost!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {/* Threads Button */}
            <a
              href="https://threads.net/@the_rafshan"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-6 py-3 border-2 border-[#282825] transition-transform hover:-translate-y-1 hover:-translate-x-1"
              style={{
                fontFamily: "var(--font-jetbrains-mono)",
                backgroundColor: "#ffffff",
                color: "#282825",
                boxShadow: "4px 4px 0px #282825",
                fontWeight: 900,
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4.8 8.4" />
              </svg>
              @the_rafshan
            </a>

            {/* Instagram Button */}
            <a
              href="https://instagram.com/the_rafshan"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-6 py-3 border-2 border-[#282825] transition-transform hover:-translate-y-1 hover:-translate-x-1"
              style={{
                fontFamily: "var(--font-jetbrains-mono)",
                backgroundColor: "#F7CB46",
                color: "#282825",
                boxShadow: "4px 4px 0px #282825",
                fontWeight: 900,
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
              @the_rafshan
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
