import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import { AdminReport } from '@/hooks/useAdmin';

interface ReportsLogProps {
  selectedUserId: string | null;
  currentUserReports: AdminReport[];
  selectedReport: AdminReport | null;
  onSelectReport: (report: AdminReport) => void;
}

export function ReportsLog({
  selectedUserId,
  currentUserReports,
  selectedReport,
  onSelectReport
}: ReportsLogProps) {
  return (
    <div className="h-full flex flex-col bg-sidebar/30">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-xs font-bold text-sidebar-foreground uppercase tracking-wider">Reports Log</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-2 space-y-1">
        {!selectedUserId ? (
          <div className="text-center py-20 px-4">
            <p className="text-[10px] text-muted-foreground">Select a user to view their specific prediction logs.</p>
          </div>
        ) : (
          currentUserReports.map((report, i) => (
            <motion.button
              key={report.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.02 }}
              onClick={() => onSelectReport(report)}
              className={`w-full text-left p-4 rounded-xl transition-all relative ${
                selectedReport?.id === report.id 
                ? 'bg-secondary border border-border shadow-sm' 
                : 'hover:bg-sidebar-accent/30'
              }`}
            >
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                    report.dharma_score >= 75 ? 'bg-coral/10 text-coral' : 'bg-success/10 text-success'
                  }`}>
                    {report.dharma_score}%
                  </span>
                  <span className="text-[10px] text-muted-foreground tabular-nums">
                    {new Date(report.created_at).toLocaleDateString()}
                  </span>
                </div>
                <span className="text-xs font-medium text-foreground truncate">
                  {report.result_status}
                </span>
              </div>
            </motion.button>
          ))
        )}
      </div>
    </div>
  );
}
