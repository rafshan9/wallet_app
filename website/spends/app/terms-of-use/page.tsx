import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function TermsOfUsePage() {
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
              backgroundColor: "#DE1A58",
              color: "#fff",
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
            Terms of Use
          </h1>
          <div
            className="text-[#282825] space-y-6 text-base leading-relaxed"
            style={{ fontFamily: "var(--font-jetbrains-mono)" }}
          >
            <p>
              <strong>Last Updated: {new Date().toLocaleDateString()}</strong>
            </p>
            <p>
              Welcome to SPENDS! By accessing or using our application, you
              agree to be bound by these Terms of Use.
            </p>
            <h2 className="text-xl font-bold mt-4">1. Acceptance of Terms</h2>
            <p>
              By downloading, installing, or using the SPENDS app, you agree to
              comply with these terms. If you do not agree, please do not use
              the app.
            </p>
            <h2 className="text-xl font-bold mt-4">2. User Conduct</h2>
            <p>
              You agree to use SPENDS for its intended purpose of tracking
              expenses and managing your finances. You are responsible for the
              data you enter.
            </p>
            <h2 className="text-xl font-bold mt-4">3. Beta Release</h2>
            <p>
              SPENDS is currently in a Beta phase. Features and functionalities
              may change without prior notice, and the app is provided &quot;as
              is&quot; without warranties of any kind.
            </p>
            <h2 className="text-xl font-bold mt-4">4. Changes to Terms</h2>
            <p>
              We reserve the right to update these terms at any time. Continued
              use of the app implies acceptance of the new terms.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
