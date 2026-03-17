import { Activity, ChevronRight } from 'lucide-react';
import React from 'react'
import { motion } from "framer-motion";

function ComparisionSection() {
  return (
   <section id="comparison" className="py-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-coral">
                The Shift
              </h2>
              <h3 className="text-4xl font-display font-bold">
                Traditional Scoring vs. <span className="text-coral">Dharma Score</span> 
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Traditional scores like Alvarado or PAS rely on static
                heuristics. Dharma Score adapts to complex patient profiles using
                using advanced machine learning.
              </p>

              <div className="space-y-4 pt-4">
                <ComparisonItem
                  traditional="Linear Statistical Models"
                  dharma="Real-time machine learning inference"
                />
                <ComparisonItem
                  traditional="Limited explainability (Black box)"
                  dharma="Full inference explanation with SHAP charts"
                />
                <ComparisonItem
                  traditional="Extremely low specificity "
                  dharma="High sensitivity and specificity (>95%) with case level uncertainty estimates"
                />
                <ComparisonItem
                  traditional="No prognostic guidance"
                  dharma="Severity assessment feature"
                />
             
              </div>
            </div>

            <div className="relative group p-1 bg-gradient-to-br from-coral/20 via-primary/10 to-transparent rounded-[2rem]">
              <div className="bg-background rounded-[1.9rem] p-8 space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Activity className="w-48 h-48" />
                </div>
                <div className="space-y-4">
                  <h4 className="text-2xl font-bold font-display">
                    <span className="text-coral">Dharma </span>
                  </h4>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-coral"
                      initial={{ width: 0 }}
                      whileInView={{ width: "92%" }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
                    DIAGNOSTIC AUC-ROC of 0.98 in cross-validation
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Stat label="AS" value="+ 0.22" />
                  <Stat label="PAS" value="+ 0.28" />
                 

                </div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
                    Prognostic Performance
                  </p>
                <div className="grid grid-cols-2 gap-4">
                  <Stat label="Sensitivity" value="96 %" />
                  <Stat label="NPV" value="97 %" />
                 

                </div>

              </div>
            </div>
          </div>
        </div>
      </section>
  )
}

export default ComparisionSection


function ComparisonItem({
  traditional,
  dharma,
}: {
  traditional: string;
  dharma: string;
}) {
  return (
    <div className="grid grid-cols-[1fr_24px_1fr] gap-4 items-center py-3 border-b border-border/50">
      <span className="text-sm text-muted-foreground text-right">
        {traditional}
      </span>
      <ChevronRight className="w-4 h-4 text-coral opacity-40 mx-auto" />
      <span className="text-sm font-medium">{dharma}</span>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 rounded-xl bg-secondary/50 border border-border/50">
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
        {label}
      </p>
      <p className="text-lg font-display font-bold text-coral leading-none mt-1">
        {value}
      </p>
    </div>
  );
}

