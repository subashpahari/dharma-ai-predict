import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Brain, 
  Activity, 
  ArrowRight, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  Database,
  BarChart3,
  Stethoscope
} from 'lucide-react';
import { ModeToggle } from '@/components/ModeToggle';

import { useAuth } from '@/hooks/useAuth';

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
 
  useEffect(() => {
    // Check if we are returning from an auth flow that has a pending redirection or download
    const hasPendingAction = localStorage.getItem('auth_redirect') || localStorage.getItem('pending_download');
    
    if (user && hasPendingAction) {
      navigate('/app');
    }
  }, [user, navigate]);
 
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-border bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-coral flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight hidden sm:inline">Dharma <span className="text-coral">AI</span></span>
          </div>
 
          <div className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-coral transition-colors">How it Works</a>
            <a href="#comparison" className="text-sm font-medium text-muted-foreground hover:text-coral transition-colors">Comparison</a>
            <a href="#research" className="text-sm font-medium text-muted-foreground hover:text-coral transition-colors">Research</a>
          </div>
 
          <div className="flex items-center gap-1.5 sm:gap-4">
            <ModeToggle />
            {!user ? (
              <>
                <button 
                  onClick={() => navigate('/auth')}
                  className="text-xs sm:text-sm font-medium hover:text-coral transition-colors px-1"
                >
                  Log In
                </button>
                <button 
                  onClick={() => navigate('/app')}
                  className="px-3 sm:px-5 py-1.5 sm:py-2 bg-coral text-white rounded-full text-xs sm:text-sm font-bold shadow-lg shadow-coral/20 hover:scale-105 transition-all whitespace-nowrap"
                >
                  Get Started
                </button>
              </>
            ) : (
              <button 
                onClick={() => navigate('/app')}
                className="px-4 sm:px-5 py-2 bg-coral text-white rounded-full text-xs sm:text-sm font-bold shadow-lg shadow-coral/20 hover:scale-105 transition-all"
              >
                Go to App
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-coral/10 border border-coral/20 text-coral text-xs font-bold uppercase tracking-widest">
              <Brain className="w-3.5 h-3.5" />
              Clinically Grounded AI
            </div>
            <h1 className="text-5xl lg:text-7xl font-display font-black leading-[1.1] tracking-tight">
              Predicting Pediatric <span className="text-coral">Appendicitis</span> with Evidence.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
              Dharma is a novel machine learning framework for diagnostic scoring, severity assessment, and evidence-based decision support in pediatric surgery.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => navigate('/app')}
                className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-xl shadow-primary/10"
              >
                Run Prediction <ArrowRight className="w-5 h-5" />
              </button>
              <a 
                href="https://doi.org/10.1101/2025.05.27.25328468" 
                target="_blank"
                className="px-8 py-4 bg-secondary border border-border rounded-2xl font-bold flex items-center gap-2 hover:bg-secondary/80 transition-all"
              >
                Read the Paper <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-coral/10 blur-[100px] rounded-full" />
            <img 
              src="/images/hero_mockup.png" 
              alt="Dharma AI Dashboard Mockup" 
              className="relative w-full h-auto drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)] rounded-3xl"
            />
          </motion.div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 bg-secondary/30 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-coral">Workflow</h2>
            <h3 className="text-4xl font-display font-bold">How Dharma AI Works</h3>
            <p className="text-muted-foreground max-w-lg mx-auto">Our three-step process bridges clinical data with explainable artificial intelligence.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card 
              icon={<Database className="w-6 h-6" />}
              title="Clinical Data Entry"
              description="Input patient parameters including WBC count, CRP levels, and clinical symptoms like nausea or peritonitis."
            />
            <Card 
              icon={<Brain className="w-6 h-6" />}
              title="Elastic Net Analysis"
              description="Our proprietary model analyzes non-linear relationships across clinical laboratory data to calculate precise risk scores."
            />
            <Card 
              icon={<BarChart3 className="w-6 h-6" />}
              title="SHAP Explainability"
              description="Receive personalized SHAP charts showing exactly which clinical factors contributed to the diagnosis."
            />
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section id="comparison" className="py-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-coral">The Shift</h2>
              <h3 className="text-4xl font-display font-bold">Traditional Scoring vs. Dharma AI</h3>
              <p className="text-muted-foreground leading-relaxed">
                Traditional scores like Alvarado or PAS rely on static heuristics. Dharma AI adapts to complex patient profiles using high-dimensional clinical proof.
              </p>
              
              <div className="space-y-4 pt-4">
                <ComparisonItem 
                  traditional="Manual rule-based calculations" 
                  dharma="Real-time machine learning inference" 
                />
                <ComparisonItem 
                  traditional="Limited explainability (Black box)" 
                  dharma="Full feature attribution with SHAP charts" 
                />
                <ComparisonItem 
                  traditional="Static diagnosis thresholds" 
                  dharma="Clinically grounded confidence intervals" 
                />
              </div>
            </div>

            <div className="relative group p-1 bg-gradient-to-br from-coral/20 via-primary/10 to-transparent rounded-[2rem]">
              <div className="bg-background rounded-[1.9rem] p-8 space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                   <Activity className="w-48 h-48" />
                </div>
                <div className="space-y-4">
                  <h4 className="text-2xl font-bold font-display">Dharma Elastic Net</h4>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-coral"
                      initial={{ width: 0 }}
                      whileInView={{ width: '92%' }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">92% Specificity in Pediatric Cohorts</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Stat label="WBC Correlation" value="+0.42" />
                  <Stat label="CRP Sensitivity" value="+0.38" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Research Redirection */}
      <section id="research" className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10 space-y-8">
          <Stethoscope className="w-12 h-12 mx-auto text-coral" />
          <h2 className="text-4xl md:text-5xl font-display font-bold">Grounded in Peer-Reviewed Research</h2>
          <p className="text-xl opacity-80 max-w-2xl mx-auto italic font-serif">
            "Dharma: A novel, clinically grounded machine learning framework for pediatric appendicitis - Diagnosis, severity assessment and evidence-based clinical decision support"
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
            <div className="text-left bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md">
              <p className="text-xs uppercase tracking-widest font-bold opacity-60 mb-2">Authors</p>
              <p className="font-medium">Thapa Kshetri, A. et al.</p>
            </div>
            <a 
              href="https://doi.org/10.1101/2025.05.27.25328468"
              target="_blank"
              className="group flex items-center gap-3 px-8 py-5 bg-coral rounded-2xl font-display font-bold text-white hover:scale-105 transition-all shadow-2xl shadow-coral/40"
            >
              Access Publication <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto flex flex-col md:row items-center justify-between gap-8 text-center md:text-left">
          <div className="space-y-2">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <ShieldCheck className="w-5 h-5 text-coral" />
              <span className="font-display font-bold text-lg">Dharma AI</span>
            </div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">© 2026 Pediatric Appendicitis Clinical Framework</p>
          </div>

          <div className="flex items-center gap-6">
             <a href="#" className="text-sm font-medium text-muted-foreground hover:text-coral">Twitter</a>
             <a href="#" className="text-sm font-medium text-muted-foreground hover:text-coral">LinkedIn</a>
             <a href="#" className="text-sm font-medium text-muted-foreground hover:text-coral">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Card({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 rounded-[2.5rem] bg-background border border-border hover:shadow-2xl hover:shadow-coral/5 transition-all group">
      <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-coral/10 group-hover:text-coral transition-all">
        {icon}
      </div>
      <h4 className="text-xl font-bold font-display mb-3">{title}</h4>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function ComparisonItem({ traditional, dharma }: { traditional: string, dharma: string }) {
  return (
    <div className="grid grid-cols-[1fr_24px_1fr] gap-4 items-center py-3 border-b border-border/50">
      <span className="text-sm text-muted-foreground text-right">{traditional}</span>
      <ChevronRight className="w-4 h-4 text-coral opacity-40 mx-auto" />
      <span className="text-sm font-medium">{dharma}</span>
    </div>
  );
}

function Stat({ label, value }: { label: string, value: string }) {
  return (
    <div className="p-4 rounded-xl bg-secondary/50 border border-border/50">
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">{label}</p>
      <p className="text-lg font-display font-bold text-coral leading-none mt-1">{value}</p>
    </div>
  );
}
