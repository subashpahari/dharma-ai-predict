import { motion } from 'framer-motion';
import { ExternalLink, FileText, Users, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PaperSection() {
  return (
    <section id="paper" className="py-24 sm:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-8 sm:p-12 glow-primary text-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <FileText className="w-7 h-7 text-primary" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-display font-bold mb-4">
            Read the <span className="text-gradient">Research Paper</span>
          </h2>

          <p className="text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            DharmaAI is built on peer-reviewed research. Our model was developed and validated on clinical
            datasets from teaching hospitals in Nepal, achieving strong diagnostic performance across
            multiple metrics.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 mb-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              Dr. Anup Thapa et al.
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              2025
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              medRxiv Preprint
            </div>
          </div>

          <Button
            size="lg"
            className="gap-2 shadow-lg shadow-primary/20"
            onClick={() => window.open('https://doi.org/10.1101/2025.05.27.25328468', '_blank')}
          >
            View on medRxiv
            <ExternalLink className="w-4 h-4" />
          </Button>

          <p className="text-xs text-muted-foreground mt-4">
            DOI: 10.1101/2025.05.27.25328468
          </p>
        </motion.div>
      </div>
    </section>
  );
}
