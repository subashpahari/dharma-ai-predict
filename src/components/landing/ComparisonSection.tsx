import { motion } from 'framer-motion';
import { X, Check, Clock, Brain, AlertTriangle, Zap } from 'lucide-react';

const traditional = [
  { icon: Clock, text: 'Hours of clinical scoring (Alvarado, PAS, AIR)' },
  { icon: AlertTriangle, text: 'Subjective interpretation varies by clinician' },
  { icon: X, text: 'No explainability — just a number' },
  { icon: X, text: 'Doesn\'t incorporate all available features' },
];

const ours = [
  { icon: Zap, text: 'Instant prediction in under 2 seconds' },
  { icon: Brain, text: 'Objective ML model trained on real clinical data' },
  { icon: Check, text: 'SHAP explanations for every prediction' },
  { icon: Check, text: 'Uses 10+ clinical, lab & imaging features' },
];

export default function ComparisonSection() {
  return (
    <section id="comparison" className="py-24 sm:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
            Traditional Scoring <span className="text-gradient">vs DharmaAI</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            See why clinicians are choosing machine learning over legacy appendicitis scores.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {/* Traditional */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-8 border-destructive/20"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                <X className="w-5 h-5 text-destructive" />
              </div>
              <h3 className="text-xl font-display font-semibold text-foreground">Traditional Approach</h3>
            </div>
            <ul className="space-y-4">
              {traditional.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center shrink-0 mt-0.5">
                    <item.icon className="w-3.5 h-3.5 text-destructive" />
                  </div>
                  <span className="text-sm text-muted-foreground">{item.text}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* DharmaAI */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-8 border-primary/20 glow-primary"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-display font-semibold text-foreground">DharmaAI Approach</h3>
            </div>
            <ul className="space-y-4">
              {ours.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <item.icon className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground">{item.text}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
