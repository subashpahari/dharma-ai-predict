import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Nabvar from "@/components/reusables/navbar";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/secttions/home/landing";
import HowItWorks from "@/secttions/home/how-it-works";
import ComparisionSection from "@/secttions/home/comparision-section";
import ResearchRedirection from "@/secttions/home/research-rediretion";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const hasPendingAction =
      localStorage.getItem("auth_redirect") ||
      localStorage.getItem("pending_download");

    if (user && hasPendingAction) {
      navigate("/app");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
     <Nabvar />
    <Landing />
    <HowItWorks />
    <ComparisionSection />
    <ResearchRedirection />
    <Footer />
    </div>
  );
}
