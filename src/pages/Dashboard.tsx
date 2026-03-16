import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Menu, 
  Brain, 
  MoreVertical, 
  Activity, 
  Download, 
  Info, 
  ShieldCheck, 
  LogOut,
  AlertTriangle
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

import LeftSidebar from '@/components/LeftSidebar';
import PredictionForm from '@/components/PredictionForm';
import DharmaScoreCard from '@/components/DharmaScoreCard';
import ShapChart from '@/components/ShapChart';
import ClinicalEvidenceModal from '@/components/ClinicalEvidenceModal';
import CreatorModal from '@/components/CreatorModal';
import { ModeToggle } from '@/components/ModeToggle';
import GoogleTranslate from '@/components/GoogleTranslate';
import { useAuth } from '@/hooks/useAuth';
import { useReports, type Report } from '@/hooks/useReports';
import { calculatePrediction, type PredictionInput, type PredictionResult } from '@/lib/prediction';
import { generatePDF } from '@/lib/pdfExport';


export default function Dashboard() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { reports, loading: reportsLoading, saveReport } = useReports(user?.id);

  const [result, setResult] = useState<PredictionResult | null>(null);
  const [lastInput, setLastInput] = useState<PredictionInput | null>(null);
  const [predicting, setPredicting] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<string>();
  const [showForm, setShowForm] = useState(true);
  const [clinicalOpen, setClinicalOpen] = useState(false);
  const [creatorOpen, setCreatorOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  // Restore guest session and handle auto-download after login
  useEffect(() => {
    // 1. Restore clinical state if coming back from auth
    const savedInput = localStorage.getItem('guest_last_input');
    const savedResult = localStorage.getItem('guest_result');
    
    if (!lastInput && savedInput) {
      setLastInput(JSON.parse(savedInput));
      setShowForm(false);
    }
    if (!result && savedResult) {
      setResult(JSON.parse(savedResult));
    }

    // 2. Handle auto-download
    const isAutoDownload = searchParams.get('download') === 'true' || localStorage.getItem('pending_download') === 'true';
    const currentInput = lastInput || (savedInput ? JSON.parse(savedInput) : null);
    const currentResult = result || (savedResult ? JSON.parse(savedResult) : null);

    if (user && isAutoDownload && currentInput && currentResult) {
      generatePDF(currentInput, currentResult);
      
      // Clean up session storage/params
      searchParams.delete('download');
      setSearchParams(searchParams);
      localStorage.removeItem('pending_download');
      localStorage.removeItem('guest_last_input');
      localStorage.removeItem('guest_result');
    }

    // 3. Clear redirection flags once we've successfully reached the dashboard
    if (user) {
      localStorage.removeItem('auth_redirect');
      // If there's no data to download, clear the flag anyway to prevent redirect loops
      if (!currentInput || !currentResult) {
        localStorage.removeItem('pending_download');
      }
    }
  }, [user, lastInput, result, searchParams, setShowForm]);
 
  const handlePredict = useCallback(async (input: PredictionInput) => {
    setPredicting(true);
    try {
      const res = await calculatePrediction(input);
      setResult(res);
      setLastInput(input);
      setShowForm(false);
      if (user) {
        await saveReport(input, res);
      }
    } catch (error) {
      console.error('Prediction error:', error);
    } finally {
      setPredicting(false);
    }
  }, [user, saveReport]);

  const handleSelectReport = useCallback(async (report: any) => {
    setSelectedReportId(report.id);
    setShowForm(false);
    
    const input: PredictionInput = {
      nausea: report.nausea,
      lossOfAppetite: report.loss_of_appetite,
      peritonitis: report.peritonitis as any,
      urinaryKetones: report.urinary_ketones as any,
      freeFluids: report.free_fluids,
      wbcCount: report.wbc_count,
      bodyTemperature: report.body_temperature,
      neutrophilPercentage: report.neutrophil_percentage,
      crp: report.crp,
      appendixDiameter: report.appendix_diameter,
    };

    setLastInput(input);

    // Show initial result from DB immediately
    const complicationData = report.complication_status ? {
      probability: report.complication_score,
      confidenceLow: report.complication_low,
      confidenceHigh: report.complication_high,
      result: report.complication_status,
      note: report.complication_note,
      shapValues: []
    } : undefined;

    setResult({
      dharmaScore: report.dharma_score,
      confidenceLow: report.confidence_low,
      confidenceHigh: report.confidence_high,
      resultStatus: report.result_status,
      clinicalNote: report.clinical_note,
      shapValues: [],
      complication: complicationData
    });

    // Re-calculate to get SHAP values
    try {
      const fullResult = await calculatePrediction(input);
      setResult(fullResult);
    } catch (e) {
      console.error("Failed to re-calculate SHAP", e);
    }
  }, []);


  const handleNewPrediction = () => {
    setShowForm(true);
    setResult(null);
    setLastInput(null);
    setSelectedReportId(undefined);
  };

  const handleDownloadPDF = () => {
    if (!user) {
      // Save EVERYTHING to survive the OAuth reload
      localStorage.setItem('pending_download', 'true');
      localStorage.setItem('auth_redirect', '/app');
      if (lastInput) localStorage.setItem('guest_last_input', JSON.stringify(lastInput));
      if (result) localStorage.setItem('guest_result', JSON.stringify(result));
      
      navigate('/auth?redirect=/app&download=true');
      return;
    }
    if (lastInput && result) generatePDF(lastInput, result);
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden relative">
      {/* Header */}
      <header className="h-14 border-b border-border flex items-center justify-between px-4 sm:px-5 flex-shrink-0 bg-sidebar z-20">
        <div className="flex items-center gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <button className="lg:hidden p-2 hover:bg-secondary rounded-lg transition-colors">
                <Menu className="w-5 h-5 text-muted-foreground" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72 border-r-border">
              <LeftSidebar
                reports={reports}
                loading={reportsLoading}
                onSelectReport={handleSelectReport}
                selectedReportId={selectedReportId}
                onNewPrediction={handleNewPrediction}
              />
            </SheetContent>
          </Sheet>

          <Link to="/" className="flex items-center gap-3 group transition-opacity hover:opacity-80">
              <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center flex-shrink-0">
              <img
                src="/images/logo.png" // path to your logo
                alt="Dharma Logo"
                className="w-7 h-7 object-contain"
              />
            </div>
            <span className="font-display font-bold text-xl tracking-tight hidden sm:inline">
              Dharma <span className="text-coral">AI</span>
            </span>
          </Link>
        </div>
        
        <div className="flex items-center gap-0.5 sm:gap-2">
          <GoogleTranslate />
          <ModeToggle />
          
          {!user && (
            <button 
              onClick={() => navigate('/auth')}
              className="px-2 sm:px-3 py-1.5 bg-coral text-white rounded-lg text-[10px] font-bold shadow-lg shadow-coral/20 hover:scale-105 transition-all ml-1 sm:ml-2 flex-shrink-0"
            >
              Log In
            </button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1.5 sm:p-2 hover:bg-secondary rounded-lg transition-colors ml-0.5">
                <MoreVertical className="w-5 h-5 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuItem onClick={() => setClinicalOpen(true)}>
                <ShieldCheck className="mr-2 h-4 w-4 text-coral" />
                <span>Clinical Evidence</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCreatorOpen(true)}>
                <Info className="mr-2 h-4 w-4 text-primary" />
                <span>About Creator</span>
              </DropdownMenuItem>
              {user && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="text-red-500 hover:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log Out</span>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-80 flex-shrink-0 border-r border-border">
          <LeftSidebar
            reports={reports}
            loading={reportsLoading}
            onSelectReport={handleSelectReport}
            selectedReportId={selectedReportId}
            onNewPrediction={handleNewPrediction}
          />
        </aside>

        {/* Middle Canvas */}
        <main className="flex-1 overflow-y-auto scrollbar-thin p-4 sm:p-6 space-y-6">
          <div className="max-w-5xl mx-auto w-full">
            <div className="flex items-center justify-between mb-4 px-2">
              {!showForm && (
                <button
                  onClick={handleNewPrediction}
                  className="px-3 py-1.5 bg-secondary hover:bg-secondary/80 rounded-lg text-[10px] font-bold transition-all border border-border"
                >
                  Clear Results
                </button>
              )}
            </div>

            {showForm ? (
              <div className="max-w-2xl mx-auto">
                <PredictionForm onSubmit={handlePredict} loading={predicting} />
              </div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                {/* 1. Summary with Download Button (FOCUSED) */}
                {result && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-6 border-coral/20 bg-coral/[0.02]"
                  >
                    <div className="flex items-start justify-between gap-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 mb-1">
                          <Activity className="w-4 h-4 text-coral" />
                          <h4 className="text-[10px] font-bold uppercase tracking-widest text-coral">Clinical Summary</h4>
                        </div>
                        <p className="text-base text-secondary-foreground leading-relaxed font-medium">
                          The <strong className="text-foreground">Dharma Score</strong> is{' '}
                          <strong className="text-coral underline underline-offset-4 decoration-2">{result.dharmaScore}%</strong>,{' '}
                          indicating a <strong className="text-foreground">{result.resultStatus.toLowerCase()}</strong>.{' '}
                          {result.clinicalNote}
                        </p>
                      </div>
                      <button
                        onClick={handleDownloadPDF}
                        className="flex items-center gap-2 px-5 py-3 bg-coral text-white rounded-xl text-xs font-bold shadow-xl shadow-coral/20 hover:scale-105 active:scale-95 transition-all shrink-0"
                      >
                        <Download className="w-4 h-4" />
                        Download PDF
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* 2. Side-by-Side Boxes for Score and Complication */}
                {result && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DharmaScoreCard result={result} mode="score" />
                    {result.complication ? (
                      <DharmaScoreCard result={result} mode="complication" />
                    ) : (
                      <div className="glass-card p-6 flex items-center justify-center border-dashed">
                        <p className="text-xs text-muted-foreground italic">No complication status processed for this case.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. Side-by-Side SHAP Graphs */}
                {result && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {result.shapValues.length > 0 && (
                      <div className="space-y-3 glass-card p-4">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest pl-2 flex items-center gap-2">
                          <Brain className="w-3.5 h-3.5" /> Diagnosis Interpretation
                        </h4>
                        <ShapChart shapValues={result.shapValues} />
                      </div>
                    )}

                    {result.complication && result.complication.shapValues.length > 0 && (
                      <div className="space-y-3 glass-card p-4">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest pl-2 flex items-center gap-2">
                          <AlertTriangle className="w-3.5 h-3.5 text-warning" /> Complication Drivers
                        </h4>
                        <ShapChart shapValues={result.complication.shapValues} />
                      </div>
                    )}
                  </div>
                )}

                {/* 4. Clinical Parameters (Legacy table) */}
                {lastInput && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="glass-card overflow-hidden"
                  >
                    <div className="px-5 py-3 border-b border-border bg-sidebar/30 flex items-center gap-2">
                      <Activity className="w-3.5 h-3.5 text-primary" />
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-foreground">Detailed Clinical Evidence Submitted</h4>
                    </div>
                    <div className="p-4 grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-y-4 gap-x-2">
                       <DataPoint label="Nausea" value={lastInput.nausea ? "Positive" : "Negative"} highlight={lastInput.nausea} />
                       <DataPoint label="Loss of Appetite" value={lastInput.lossOfAppetite ? "Positive" : "Negative"} highlight={lastInput.lossOfAppetite} />
                       <DataPoint label="Peritonitis" value={lastInput.peritonitis} highlight={lastInput.peritonitis !== 'none'} />
                       <DataPoint label="WBC" value={lastInput.wbcCount.toString()} />
                       <DataPoint label="Temp" value={`${lastInput.bodyTemperature}°C`} />
                       <DataPoint label="Neutrophil" value={`${lastInput.neutrophilPercentage}%`} />
                       <DataPoint label="CRP" value={lastInput.crp.toString()} />
                       <DataPoint label="Diameter" value={`${lastInput.appendixDiameter}mm`} highlight={lastInput.appendixDiameter > 6} />
                       <DataPoint label="Free Fluids" value={lastInput.freeFluids ? "Present" : "None"} highlight={lastInput.freeFluids} />
                       <DataPoint label="Urinary Ketones" value={lastInput.urinaryKetones} highlight={lastInput.urinaryKetones !== 'none'} />
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </div>
        </main>
      </div>

      <ClinicalEvidenceModal open={clinicalOpen} onClose={() => setClinicalOpen(false)} />
      <CreatorModal open={creatorOpen} onClose={() => setCreatorOpen(false)} />
    </div>
  );
}

function DataPoint({ label, value, highlight }: { label: string, value: string, highlight?: boolean }) {
  return (
    <div className="space-y-0.5 min-w-0">
      <span className="text-[9px] text-muted-foreground uppercase tracking-tight font-medium block truncate">{label}</span>
      <p className={`text-xs font-semibold truncate ${highlight ? 'text-coral' : 'text-foreground'}`}>
        {value}
      </p>
    </div>
  );
}
