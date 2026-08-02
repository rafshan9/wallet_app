import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ContactPage() {
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
              backgroundColor: "#A8FF57",
              color: "#282825",
              boxShadow: "3px 3px 0px #282825",
            }}
          >
            Get In Touch
          </div>
          <h1
            className="font-bold text-[#282825] mb-8"
            style={{
              fontFamily: "var(--font-jetbrains-mono)",
              fontSize: "clamp(28px, 4vw, 42px)",
            }}
          >
            Contact Us
          </h1>
          <div
            className="text-[#282825] space-y-6 text-base leading-relaxed"
            style={{ fontFamily: "var(--font-jetbrains-mono)" }}
          >
            <p>
              If you have any questions, suggestions, or just want to say hi,
              feel free to reach out.
            </p>
            <p>
              <strong>Email:</strong>{" "}
              <a
                href="mailto:hello@spends.com"
                className="underline decoration-2 decoration-[#F7CB46] hover:text-[#D9313F] transition-colors"
              >
                hello@spends.com
              </a>
            </p>
            <p>
              <strong>Social:</strong> Hit us up on{" "}
              <a
                href="https://twitter.com/the_rafshan"
                className="underline decoration-2 decoration-[#A8FF57] hover:text-[#D9313F] transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Twitter / X
              </a>{" "}
              or{" "}
              <a
                href="https://instagram.com/the_rafshan"
                className="underline decoration-2 decoration-[#F7CB46] hover:text-[#D9313F] transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>
              .
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
