import { motion } from 'framer-motion';
import { FileText, Clock, Plus, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { Report } from '@/hooks/useReports';

interface LeftSidebarProps {
  reports: Report[];
  loading: boolean;
  onSelectReport: (report: Report) => void;
  selectedReportId?: string;
  onNewPrediction: () => void;
}

export default function LeftSidebar({ reports, loading, onSelectReport, selectedReportId, onNewPrediction }: LeftSidebarProps) {
  const getScoreIcon = (score: number) => {
    if (score >= 75) return <TrendingUp className="w-3.5 h-3.5 text-coral" />;
    if (score >= 45) return <Minus className="w-3.5 h-3.5 text-warning" />;
    return <TrendingDown className="w-3.5 h-3.5 text-success" />;
  };

  return (
    <div className="w-full h-full flex flex-col bg-sidebar">

      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-sidebar-foreground tracking-wide uppercase">Saved Reports</h2>
          <FileText className="w-4 h-4 text-muted-foreground" />
        </div>
        <button
          onClick={onNewPrediction}
          className="w-full py-2.5 border border-dashed border-border rounded-lg text-sm text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Prediction
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-2 space-y-1">
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        )}
        {!loading && reports.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-8 px-4">
            No reports yet. Run your first prediction to get started.
          </p>
        )}
        {reports.map((report, i) => (
          <motion.button
            key={report.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
            onClick={() => onSelectReport(report)}
            className={`w-full text-left p-3 rounded-lg transition-all text-sm group ${
              selectedReportId === report.id
                ? 'bg-sidebar-accent border border-primary/20'
                : 'hover:bg-sidebar-accent/50'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              {getScoreIcon(report.dharma_score)}
              <span className="font-medium text-foreground truncate">
                Score: {report.dharma_score}%
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {new Date(report.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
