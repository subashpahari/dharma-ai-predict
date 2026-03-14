import { motion } from 'framer-motion';
import { ClipboardList, Cpu, BarChart3, FileText } from 'lucide-react';

const steps = [
  {
    icon: ClipboardList,
    title: 'Enter Clinical Data',
    description: 'Input patient vitals, lab results, and imaging findings through our guided clinical form.',
  },
  {
    icon: Cpu,
    title: 'AI Analysis',
    description: 'Our trained model processes 10+ clinical features using a gradient-boosted ensemble approach.',
  },
  {
    icon: BarChart3,
    title: 'Explainable Results',
    description: 'Get a Dharma Score with SHAP-based feature contributions showing exactly why the prediction was made.',
  },
  {
    icon: FileText,
    title: 'Export Report',
    description: 'Download a professional clinical PDF report ready for documentation and peer review.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 sm:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
            How It <span className="text-gradient">Works</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From clinical input to actionable insight in under two seconds.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 relative group hover:border-primary/30 transition-colors"
            >
              {/* Step number */}
              <div className="absolute -top-3 -left-3 w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shadow-lg shadow-primary/30">
                {i + 1}
              </div>

              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                <step.icon className="w-6 h-6 text-primary" />
              </div>

              <h3 className="font-display font-semibold text-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
