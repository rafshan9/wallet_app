import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function PrivacyPolicyPage() {
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
              backgroundColor: "#F7CB46",
              color: "#282825",
              boxShadow: "3px 3px 0px #282825",
            }}
          >
            Legal
          </div>
          <h1
            className="font-bold text-[#282825] mb-8"
            style={{
              fontFamily: "var(--font-jetbrains-mono)",
              fontSize: "clamp(28px, 4vw, 42px)",
            }}
          >
            Privacy Policy
          </h1>
          <div
            className="text-[#282825] space-y-6 text-base leading-relaxed"
            style={{ fontFamily: "var(--font-jetbrains-mono)" }}
          >
            <p>
              <strong>Last Updated: {new Date().toLocaleDateString()}</strong>
            </p>
            <p>
              At SPENDS, we believe in intentional effort and data privacy. We
              do not sell your personal data or connect to your bank accounts
              without explicit, secure intent.
            </p>
            <h2 className="text-xl font-bold mt-4">1. Data Collection</h2>
            <p>
              We collect only the data necessary to provide and improve our
              services. Since our focus is on manual entry and AI parsing, your
              data stays within the app context.
            </p>
            <h2 className="text-xl font-bold mt-4">2. Use of Data</h2>
            <p>
              Your expenses, goals, and notes are used solely to give you
              insights into your spending habits.
            </p>
            <h2 className="text-xl font-bold mt-4">3. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please
              contact us at{" "}
              <a
                href="mailto:hello@spends.com"
                className="underline decoration-2 decoration-[#F7CB46]"
              >
                hello@spends.com
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
