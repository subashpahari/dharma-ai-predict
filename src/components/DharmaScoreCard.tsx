import { motion } from 'framer-motion';
import { Shield, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import type { PredictionResult } from '@/lib/prediction';

interface Props {
  result: PredictionResult;
  mode?: 'score' | 'complication' | 'all';
}

export default function DharmaScoreCard({ result, mode = 'all' }: Props) {
  const { dharmaScore, confidenceLow, confidenceHigh, resultStatus, clinicalNote } = result;

  const isHigh = dharmaScore >= 75;
  const isMedium = dharmaScore >= 45 && dharmaScore < 75;

  const scoreColor = isHigh ? 'text-coral' : isMedium ? 'text-warning' : 'text-success';
  const StatusIcon = isHigh ? AlertTriangle : isMedium ? Info : CheckCircle;
  const ringColor = isHigh ? 'border-coral/40' : isMedium ? 'border-warning/40' : 'border-success/40';
  const bgGlow = isHigh ? 'shadow-[0_0_40px_-10px_hsl(0,65%,58%,0.2)]' : isMedium ? 'shadow-[0_0_40px_-10px_hsl(36,77%,65%,0.2)]' : 'shadow-[0_0_40px_-10px_hsl(142,60%,45%,0.2)]';

  const ScoreView = (
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
      <div className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 ${ringColor} flex items-center justify-center flex-shrink-0 bg-card shadow-inner`}>
        <div className="text-center">
          <span className={`text-3xl sm:text-4xl font-display font-bold ${scoreColor}`}>{dharmaScore}</span>
          <span className={`block text-[9px] sm:text-[10px] uppercase tracking-tighter ${scoreColor} opacity-70 font-bold`}>Score</span>
        </div>
      </div>

      <div className="flex-1 min-w-0 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <StatusIcon className={`w-5 h-5 ${scoreColor}`} />
            <h3 className={`font-display font-bold text-xl ${scoreColor}`}>{resultStatus}</h3>
          </div>
          <div className="px-2 py-0.5 rounded-full bg-secondary text-[10px] font-bold text-muted-foreground w-fit mx-auto sm:mx-0">
            CI: {confidenceLow}% – {confidenceHigh}%
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 rounded-xl bg-secondary/40 border border-border/50">
          <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0 hidden sm:block" />
          <p className="text-sm text-secondary-foreground leading-relaxed italic">
            "{clinicalNote}"
          </p>
        </div>
      </div>
    </div>
  );

  const ComplicationView = result.complication && (
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
      <div className={`w-20 h-20 rounded-full border-4 ${result.complication.probability >= 50 ? 'border-coral/30' : 'border-warning/30'} flex items-center justify-center flex-shrink-0 bg-secondary/30`}>
        <div className="text-center">
          <span className={`text-xl font-bold ${result.complication.probability >= 50 ? 'text-coral' : 'text-warning'}`}>{result.complication.probability}%</span>
        </div>
      </div>

      <div className="flex-1 w-full">
        <div className="flex items-center gap-2 mb-2 justify-center sm:justify-start">
          <span className={`text-sm font-bold ${result.complication.probability >= 50 ? 'text-coral' : 'text-warning'}`}>
            {result.complication.result}
          </span>
          <div className="px-2 py-0.5 rounded-full bg-secondary text-[9px] font-bold text-muted-foreground">
            CI: {result.complication.confidenceLow}% – {result.complication.confidenceHigh}%
          </div>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed p-3 rounded-lg bg-secondary/20 border border-border/40 italic">
          "{result.complication.note}"
        </p>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className={`glass-card p-6 ${bgGlow} h-full`}
    >
      {(mode === 'all' || mode === 'score') && ScoreView}
      
      {mode === 'all' && result.complication && (
        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className={`w-4 h-4 ${result.complication.probability >= 50 ? 'text-coral' : 'text-warning'}`} />
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">Complication Risk Analysis</h4>
          </div>
          {ComplicationView}
        </div>
      )}

      {mode === 'complication' && result.complication && (
        <div className="h-full flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className={`w-4 h-4 ${result.complication.probability >= 50 ? 'text-coral' : 'text-warning'}`} />
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">Complication Risk</h4>
          </div>
          {ComplicationView}
        </div>
      )}
    </motion.div>
  );
}
