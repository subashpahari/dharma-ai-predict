import { motion } from 'framer-motion';
import { Download, BookOpen, User, Settings, LogOut, Brain } from 'lucide-react';

interface RightSidebarProps {
  onDownloadPDF: () => void;
  onClinicalEvidence: () => void;
  onCreatorInfo: () => void;
  onSignOut: () => void;
  userEmail?: string;
  hasResult: boolean;
}

const ToolButton = ({ icon: Icon, label, onClick, disabled, badge }: { icon: any; label: string; onClick: () => void; disabled?: boolean; badge?: string }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    disabled={disabled}
    className="w-full glass-card-hover p-4 flex flex-col items-center gap-2 text-center disabled:opacity-30 disabled:cursor-not-allowed group"
  >
    <div className="relative">
      <Icon className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
      {badge && (
        <span className="absolute -top-1 -right-3 text-[9px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full font-bold">
          {badge}
        </span>
      )}
    </div>
    <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">{label}</span>
  </motion.button>
);

export default function RightSidebar({ onDownloadPDF, onClinicalEvidence, onCreatorInfo, onSignOut, userEmail, hasResult }: RightSidebarProps) {
  return (
    <div className="w-64 min-w-[240px] border-l border-border bg-sidebar flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-sidebar-foreground tracking-wide uppercase">Studio</h2>
          <Settings className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>

      <div className="flex-1 p-3 space-y-2 overflow-y-auto scrollbar-thin">
        <ToolButton icon={Download} label="Download PDF Report" onClick={onDownloadPDF} disabled={!hasResult} />
        <ToolButton icon={BookOpen} label="Clinical Evidence" onClick={onClinicalEvidence} />
        <ToolButton icon={User} label="About Creator" onClick={onCreatorInfo} />
      </div>

      <div className="p-3 border-t border-border space-y-2">
        {userEmail && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/30">
            <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
              <Brain className="w-3.5 h-3.5 text-primary" />
            </div>
            <span className="text-xs text-muted-foreground truncate flex-1">{userEmail}</span>
          </div>
        )}
        <button
          onClick={onSignOut}
          className="w-full flex items-center justify-center gap-2 py-2 text-xs text-muted-foreground hover:text-coral transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
