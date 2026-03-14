import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
import type { ShapValue } from '@/lib/prediction';

interface Props {
  shapValues: ShapValue[];
}

export default function ShapChart({ shapValues }: Props) {
  const maxAbs = Math.max(...shapValues.map(s => Math.abs(s.contribution)), 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-card p-6"
    >
      <div className="flex items-center gap-2 mb-5">
        <BarChart3 className="w-5 h-5 text-primary" />
        <h3 className="font-display font-semibold text-foreground">Feature Contributions (SHAP)</h3>
      </div>

      <div className="space-y-3">
        {shapValues.map((item, i) => {
          const width = (Math.abs(item.contribution) / maxAbs) * 100;
          const isPositive = item.contribution >= 0;

          return (
            <motion.div
              key={item.feature}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i }}
              className="flex items-center gap-2 sm:gap-3"
            >
              <span className="text-[10px] sm:text-xs text-muted-foreground w-20 sm:w-32 text-right flex-shrink-0 truncate" title={item.feature}>
                {item.feature}
              </span>
              <div className="flex-1 flex items-center h-5 sm:h-6">
                <div className="relative w-full h-4 sm:h-5 bg-secondary/50 rounded overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${width}%` }}
                    transition={{ duration: 0.6, delay: 0.05 * i }}
                    className={`absolute top-0 h-full rounded ${
                      isPositive ? 'bg-coral/70 left-0' : 'bg-success/70 left-0'
                    }`}
                  />
                </div>
              </div>
              <span className={`text-[10px] sm:text-xs font-mono w-10 sm:w-12 text-right flex-shrink-0 ${isPositive ? 'text-coral' : 'text-success'}`}>
                {isPositive ? '+' : ''}{item.contribution.toFixed(1)}
              </span>
            </motion.div>

          );
        })}
      </div>

      <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-coral/70" />
          <span>Increases risk</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-success/70" />
          <span>Decreases risk</span>
        </div>
      </div>
    </motion.div>
  );
}
