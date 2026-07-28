import HeroSection from "./components/HeroSection";
import ExpenseSection from "./components/ExpenseSection";
import GoalsSection from "./components/GoalsSection";
import AboutSection from "./components/AboutSection";
import Footer from "./components/Footer";
export default function Home() {
  return (
    <main>
      <HeroSection />
      <ExpenseSection />
      <GoalsSection />
      <AboutSection />
      <Footer />
    </main>
  );
}
