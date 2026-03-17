import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, BookOpen } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ClinicalEvidenceModal({ open, onClose }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={e => e.stopPropagation()}
            className="glass-card glow-primary p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                <h2 className="font-display font-bold text-lg text-foreground">Clinical Evidence</h2>
              </div>
              <button onClick={onClose} className="p-1 hover:bg-secondary rounded-lg transition-colors">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="space-y-4 text-sm text-secondary-foreground">
              <p>
                The Dharma framework is built by integrating clinical reasoning into every step of its system design. 
  It is intended to support healthcare professionals in the assessment of acute abdomen, specifically 
  for pediatric appendicitis, aligning seamlessly with existing clinical workflows.
              </p>
              <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                <p className="font-medium text-foreground mb-1">Reference Publication</p>
                <p className="text-muted-foreground text-xs mb-2">
                  Thapa Kshetri, A. et al. "Dharma: A novel, clinically grounded machine learning framework for pediatric appendicitis-Diagnosis, severity assessment and evidence-based clinical decision support"
                </p>
                <a
                  href="https://journals.plos.org/digitalhealth/article?id=10.1371/journal.pdig.0000908"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-primary hover:underline text-xs"
                >
                  <ExternalLink className="w-3 h-3" />
                  doi: 10.1371/journal.pdig.0000908
                </a>
              </div>
             <p>
  <strong>Performance Metrics:</strong><br />
  <em>Diagnostic Performance (cross-validation)</em><br />
  AUC-ROC: 0.93–0.99<br />
  Sensitivity: 90%–95%<br />
  Specificity: 90%–96%<br />
  Positive Predictive Value (PPV): 93%–97%<br />
  Negative Predictive Value (NPV): 87%–94%<br /><br />

  <em>Severity Assessment (cross-validation)</em><br />
  AUC-ROC: 0.97–0.99<br />
  Sensitivity: 93%–99%<br />
  Specificity: 53%–75%<br />
  PPV: 59%–72%<br />
  NPV: 94%–99%<br /><br />

  <em>If appendix not visualized or USG unavailable (n=144 test cohort)</em><br />
  AUC-ROC: 0.93–0.99<br />
  Threshold ≥44% (High Likelihood): Specificity 93%–100%, PPV 84%–100%<br />
  Threshold 25% (Low Likelihood):  Sensitivity 84%–98%, NPV 91%–99%
</p>
              <p className="text-xs text-muted-foreground italic">
                Disclaimer: This tool is intended for clinical decision support only and should not replace 
                professional medical judgment or established clinical protocols.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
