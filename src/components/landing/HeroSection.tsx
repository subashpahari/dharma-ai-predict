import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import heroMockup from '@/assets/hero-mockup.png';

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-xs font-medium text-primary">
              <Sparkles className="w-3.5 h-3.5" />
              AI-Powered Clinical Decision Support
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-[1.1] tracking-tight">
              Predict Appendicitis{' '}
              <span className="text-gradient">with Confidence</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
              DharmaAI combines machine learning with clinical expertise to deliver
              rapid, explainable appendicitis predictions — backed by peer-reviewed research.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="gap-2 shadow-lg shadow-primary/20"
                onClick={() => navigate('/auth?signup=true')}
              >
                Run Prediction
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                See How It Works
              </Button>
            </div>

            <div className="flex items-center gap-6 pt-2">
              {[
                { value: '93%', label: 'Accuracy' },
                { value: '<2s', label: 'Prediction' },
                { value: '10+', label: 'Features' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-xl font-display font-bold text-foreground">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Mockup Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative flex justify-center"
          >
            <div className="relative">
              <img
                src={heroMockup}
                alt="DharmaAI Dashboard on laptop and phone clay mockup"
                className="w-full max-w-xl drop-shadow-2xl"
                loading="eager"
              />
              {/* subtle floating glow behind image */}
              <div className="absolute inset-0 -z-10 bg-primary/10 blur-[80px] rounded-full scale-75" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
