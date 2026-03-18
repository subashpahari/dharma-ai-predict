import { motion, AnimatePresence } from "framer-motion";
import { X, User, Heart, Brain } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CreatorModal({ open, onClose }: Props) {
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
            onClick={(e) => e.stopPropagation()}
            className="glass-card glow-primary p-6 max-w-md w-full"
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                <h2 className="font-display font-bold text-lg text-foreground">
                  About Creator
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-secondary rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-primary/10 mx-auto flex items-center justify-center">
                <img
                  src="/images/anup.jpeg"
                  alt="Dr. Anup Thapa Kshetri"
                  className="w-full h-full object-cover"
                />{" "}
              </div>
              <div>
                <h3 className="font-display font-bold text-xl text-foreground">
                  Dr. Anup Thapa Kshetri, MBBS
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Founder and Lead, DharmaAI
                </p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/50 border border-border text-left">
                <p className="text-sm text-secondary-foreground leading-relaxed">
                  Medical doctor and AI developer with experience in emergency
                  and pediatric care. Creator of Dharma Score, a hybrid
                  diagnostic and prognostic system for pediatric appendicitis,
                  combining clinical insight with advanced machine learning.
                </p>
              </div>
              <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                <span>Built with</span>
                <Heart className="w-3 h-3 text-coral" />
                <span>by the DharmaAI Team</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
