import { BarChart3, Brain, Database } from 'lucide-react'
import React from 'react'

function HowItWorks() {
  return (
      <section id="how-it-works" className="py-24 bg-secondary/30 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-coral">
              Workflow
            </h2>
            <h3 className="text-4xl font-display font-bold">
              The Dharma Framework
            </h3>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Our multi-model approach bridges clinical data with explainable
              artificial intelligence.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card
              icon={<Database className="w-6 h-6" />}
              title="Clinical Data Imputation"
              description="A pre-trained clinically grounded imputation framework that intelligently manages missing clinical variables—including non-visualization of the appendix on ultrasound—ensuring reliable analysis even with incomplete patient data."
            />
            <Card
              icon={<Brain className="w-6 h-6" />}
              title="Two-Stage Analysis"
              description="Our highly accurate diagnostic model analyzes non-linear relationships across provided clinical data to calculate precise risk score (Dharma Score). If the diagnosis is positive, a second highly sensitive prognostic model evaluates the risk of complicated appendicitis, providing comprehensive clinical insights."
            />
            <Card
              icon={<BarChart3 className="w-6 h-6" />}
              title="SHAP Explainability"
              description="Receive personalized SHAP charts showing exactly which clinical factors contributed to the diagnosis."
            />
          </div>
        </div>
      </section>

  )
}

export default HowItWorks

function Card({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-8 rounded-[2.5rem] bg-background border border-border hover:shadow-2xl hover:shadow-coral/5 transition-all group">
      <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-coral/10 group-hover:text-coral transition-all">
        {icon}
      </div>
      <h4 className="text-xl font-bold font-display mb-3">{title}</h4>
      <p className="text-muted-foreground text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}
