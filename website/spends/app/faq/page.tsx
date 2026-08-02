import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function FAQPage() {
  return (
    <main
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#F9F5F2" }}
    >
      <Navbar />
      <section className="flex-grow flex flex-col items-center justify-center px-6 py-20">
        <div
          className="max-w-3xl w-full border-[3px] border-[#282825] p-8 md:p-12 bg-white"
          style={{ boxShadow: "8px 8px 0px #282825" }}
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
            Support
          </div>
          <h1
            className="font-bold text-[#282825] mb-8"
            style={{
              fontFamily: "var(--font-jetbrains-mono)",
              fontSize: "clamp(28px, 4vw, 42px)",
            }}
          >
            Frequently Asked Questions
          </h1>
          <div
            className="text-[#282825] space-y-6 text-base leading-relaxed"
            style={{ fontFamily: "var(--font-jetbrains-mono)" }}
          >
            <p>
              This page is currently being updated. We are compiling the most
              common questions from our beta testers.
            </p>
            <p>
              If you have any urgent questions, please reach out via our Contact
              page or social media.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
