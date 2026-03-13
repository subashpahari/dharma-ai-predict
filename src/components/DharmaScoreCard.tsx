import { motion } from 'framer-motion';
import { Shield, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import type { PredictionResult } from '@/lib/prediction';

interface Props {
  result: PredictionResult;
}

export default function DharmaScoreCard({ result }: Props) {
  const { dharmaScore, confidenceLow, confidenceHigh, resultStatus, clinicalNote } = result;

  const isHigh = dharmaScore >= 75;
  const isMedium = dharmaScore >= 45 && dharmaScore < 75;

  const scoreColor = isHigh ? 'text-coral' : isMedium ? 'text-warning' : 'text-success';
  const StatusIcon = isHigh ? AlertTriangle : isMedium ? Info : CheckCircle;
  const ringColor = isHigh ? 'border-coral/40' : isMedium ? 'border-warning/40' : 'border-success/40';
  const bgGlow = isHigh ? 'shadow-[0_0_40px_-10px_hsl(0,65%,58%,0.2)]' : isMedium ? 'shadow-[0_0_40px_-10px_hsl(36,77%,65%,0.2)]' : 'shadow-[0_0_40px_-10px_hsl(142,60%,45%,0.2)]';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className={`glass-card p-6 ${bgGlow}`}
    >
      <div className="flex items-start gap-5">
        {/* Score Circle */}
        <div className={`w-24 h-24 rounded-full border-4 ${ringColor} flex items-center justify-center flex-shrink-0 bg-card`}>
          <div className="text-center">
            <span className={`text-3xl font-display font-bold ${scoreColor}`}>{dharmaScore}</span>
            <span className={`text-sm ${scoreColor}`}>%</span>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <StatusIcon className={`w-5 h-5 ${scoreColor}`} />
            <h3 className={`font-display font-bold text-lg ${scoreColor}`}>{resultStatus}</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Confidence Interval: {confidenceLow}% – {confidenceHigh}%
          </p>

          <div className="flex items-start gap-2 p-3 rounded-lg bg-secondary/50 border border-border">
            <Shield className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-sm text-secondary-foreground leading-relaxed">{clinicalNote}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
