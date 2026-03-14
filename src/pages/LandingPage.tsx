import Navbar from '@/components/landing/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import HowItWorks from '@/components/landing/HowItWorks';
import ComparisonSection from '@/components/landing/ComparisonSection';
import PaperSection from '@/components/landing/PaperSection';
import Footer from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <HeroSection />
      <HowItWorks />
      <ComparisonSection />
      <PaperSection />
      <Footer />
    </div>
  );
}
