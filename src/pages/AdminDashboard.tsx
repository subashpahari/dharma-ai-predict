import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  FileText, 
  Search, 
  ArrowLeft, 
  Filter, 
  LayoutDashboard, 
  Clock, 
  Mail,
  MoreVertical,
  Activity,
  Brain,
  Shield,
  Menu,
  Settings2
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { useAdmin, type AdminReport } from '@/hooks/useAdmin';
import { ModeToggle } from '@/components/ModeToggle';
import GoogleTranslate from '@/components/GoogleTranslate';
import DharmaScoreCard from '@/components/DharmaScoreCard';
import ShapChart from '@/components/ShapChart';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { reports, loading } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<AdminReport | null>(null);
  const [isUsersOpen, setIsUsersOpen] = useState(false);
  const [isReportsOpen, setIsReportsOpen] = useState(false);

  // Group reports by user
  const userGroups = reports.reduce((acc, report) => {
    if (!acc[report.user_id]) acc[report.user_id] = [];
    acc[report.user_id].push(report);
    return acc;
  }, {} as Record<string, AdminReport[]>);

  const userIds = Object.keys(userGroups).sort();
  
  const filteredUserIds = userIds.filter(id => 
    id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentUserReports = selectedUserId ? userGroups[selectedUserId] : [];

  const UserSidebarContent = () => (
    <div className="h-full flex flex-col bg-sidebar">
      <div className="p-4 border-b border-border bg-sidebar/50">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-coral" />
          <h2 className="text-xs font-bold text-sidebar-foreground uppercase tracking-wider">Active Users ({userIds.length})</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-2 space-y-1">
        {loading && (
          <div className="flex items-center justify-center py-10">
            <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        )}
        {filteredUserIds.map((uid) => (
          <button
            key={uid}
            onClick={() => {
              setSelectedUserId(uid);
              setSelectedReport(null);
              setIsUsersOpen(false);
              // Auto-open reports drawer on mobile after selecting a user
              if (window.innerWidth < 1024) {
                setTimeout(() => setIsReportsOpen(true), 300);
              }
            }}
            className={`w-full text-left p-3 rounded-lg transition-all group flex items-center justify-between ${
              selectedUserId === uid ? 'bg-coral/10 text-coral border border-coral/20' : 'hover:bg-sidebar-accent/50 text-muted-foreground'
            }`}
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <div className={`w-2 h-2 rounded-full ${selectedUserId === uid ? 'bg-coral animate-pulse' : 'bg-border'}`} />
              <span className="text-xs font-mono truncate">{uid.slice(0, 12)}...</span>
            </div>
            <span className="text-[10px] tabular-nums bg-secondary px-1.5 py-0.5 rounded-md border border-border">
              {userGroups[uid].length}
            </span>
          </button>
        ))}
      </div>
    </div>
  );

  const ReportsSidebarContent = () => (
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
              onClick={() => {
                setSelectedReport(report);
                setIsReportsOpen(false);
              }}
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

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden relative">
      {/* Admin Header */}
      <header className="h-14 border-b border-border flex items-center justify-between px-4 sm:px-5 flex-shrink-0 bg-sidebar z-30">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="lg:hidden">
            <Sheet open={isUsersOpen} onOpenChange={setIsUsersOpen}>
              <SheetTrigger asChild>
                <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                  <Menu className="w-5 h-5 text-muted-foreground" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-72">
                <UserSidebarContent />
              </SheetContent>
            </Sheet>
          </div>

          <div className="w-8 h-8 rounded-lg bg-coral/10 flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5 text-coral" />
          </div>
          <div>
            <h1 className="font-display font-bold text-sm sm:text-lg text-gradient truncate max-w-[120px] sm:max-w-none">Admin Center</h1>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest hidden sm:block">User-Centric Oversight</span>
          </div>
        </div>

        <div className="flex-1 max-w-md mx-4 lg:mx-8 hidden lg:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search users by ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-secondary/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-coral/40 transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <GoogleTranslate />
          <div className="hidden sm:block">
            <ModeToggle />
          </div>
          
          <div className="lg:hidden">
            <Sheet open={isReportsOpen} onOpenChange={setIsReportsOpen}>
              <SheetTrigger asChild>
                <button className="p-2 hover:bg-secondary rounded-lg transition-colors relative">
                  <FileText className="w-5 h-5 text-muted-foreground" />
                  {selectedUserId && !selectedReport && (
                    <span className="absolute top-1 right-1 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-coral opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-coral"></span>
                    </span>
                  )}
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="p-0 w-72">
                <ReportsSidebarContent />
              </SheetContent>
            </Sheet>
          </div>

          <button 
            onClick={() => navigate('/')}
            className="px-2 sm:px-3 py-1.5 text-[10px] sm:text-xs bg-secondary hover:bg-secondary/80 rounded-lg text-muted-foreground items-center gap-2 transition-all border border-border flex shrink-0"
          >
            <ArrowLeft className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
            <span className="hidden xs:inline">Exit Admin</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Column 1: Users (Desktop) */}
        <aside className="w-64 flex-shrink-0 border-r border-border bg-sidebar hidden lg:flex flex-col">
          <UserSidebarContent />
        </aside>

        {/* Column 2: User Reports (Desktop) */}
        <aside className="w-72 flex-shrink-0 border-r border-border bg-sidebar/30 hidden lg:flex flex-col">
          <ReportsSidebarContent />
        </aside>

        {/* Column 3: Detail View */}
        <main className="flex-1 overflow-y-auto scrollbar-thin p-4 sm:p-6 bg-background/50 relative">

          <AnimatePresence mode="wait">
            {!selectedReport ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center space-y-6"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-coral/5 blur-3xl rounded-full" />
                  <LayoutDashboard className="w-20 h-20 text-coral/20 relative" />
                </div>
                <div className="text-center max-w-xs">
                  <h3 className="text-lg font-semibold text-foreground mb-1">Select a Report</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Choose a clinical log from the sidebar to review the full diagnostic data and user contributions.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key={selectedReport.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="max-w-3xl mx-auto space-y-6"
              >
                {/* ID Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center border border-border">
                      <Users className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold font-display tracking-tight uppercase font-mono">
                          USER: {selectedReport.user_id.slice(0, 8)}...
                        </h2>
                        <span className="text-[10px] bg-secondary px-2 py-0.5 rounded-full text-muted-foreground font-bold tracking-widest border border-border">
                          ARCHIVED
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
                        <Clock className="w-3.5 h-3.5" />
                        Generated on {new Date(selectedReport.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-secondary rounded-xl transition-all border border-transparent hover:border-border">
                    <MoreVertical className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>

                {/* Score Summary */}
                <DharmaScoreCard 
                  result={{
                    dharmaScore: selectedReport.dharma_score,
                    confidenceLow: selectedReport.confidence_low,
                    confidenceHigh: selectedReport.confidence_high,
                    resultStatus: selectedReport.result_status,
                    clinicalNote: selectedReport.clinical_note,
                    shapValues: [], // Historical SHAP usually not stored
                    complication: selectedReport.complication_status ? {
                      probability: selectedReport.complication_score || 0,
                      confidenceLow: selectedReport.complication_low || 0,
                      confidenceHigh: selectedReport.complication_high || 0,
                      result: selectedReport.complication_status,
                      note: selectedReport.complication_note || '',
                      shapValues: []
                    } : undefined
                  }} 
                />

                {/* Patient Profile */}
                <div className="glass-card overflow-hidden">
                  <div className="px-5 py-4 border-b border-border bg-sidebar/30 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-primary" />
                    <h4 className="text-xs font-bold uppercase tracking-widest text-foreground">Clinical Parameters Submitted</h4>
                  </div>
                  <div className="p-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                    <DataPoint label="Nausea" value={selectedReport.nausea ? "Positive" : "Negative"} highlight={selectedReport.nausea} />
                    <DataPoint label="Loss of Appetite" value={selectedReport.loss_of_appetite ? "Positive" : "Negative"} highlight={selectedReport.loss_of_appetite} />
                    <DataPoint label="Peritonitis" value={selectedReport.peritonitis} highlight={selectedReport.peritonitis !== 'none'} />
                    <DataPoint label="WBC Count" value={selectedReport.wbc_count.toString()} />
                    <DataPoint label="Temperature" value={`${selectedReport.body_temperature}°C`} />
                    <DataPoint label="Neutrophil" value={`${selectedReport.neutrophil_percentage}%`} />
                    <DataPoint label="CRP" value={selectedReport.crp.toString()} />
                    <DataPoint label="Diameter" value={`${selectedReport.appendix_diameter}mm`} highlight={selectedReport.appendix_diameter > 6} />
                    <DataPoint label="Free Fluids" value={selectedReport.free_fluids ? "Present" : "None"} highlight={selectedReport.free_fluids} />
                    <DataPoint label="Urinary Ketones" value={selectedReport.urinary_ketones} highlight={selectedReport.urinary_ketones !== 'none'} />
                  </div>
                </div>

                <div className="flex items-center justify-center py-4">
                   <div className="h-px bg-border flex-1" />
                   <div className="w-2 h-2 rounded-full border border-border mx-4" />
                   <div className="h-px bg-border flex-1" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function DataPoint({ label, value, highlight }: { label: string, value: string, highlight?: boolean }) {
  return (
    <div className="space-y-1">
      <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">{label}</span>
      <p className={`text-sm font-semibold truncate ${highlight ? 'text-coral' : 'text-foreground'}`}>
        {value}
      </p>
    </div>
  );
}
