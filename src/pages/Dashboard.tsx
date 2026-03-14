import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Menu, FileText, Settings2, Brain, MoreVertical, Activity } from 'lucide-react';

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';
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
  const { user, signOut } = useAuth();
  const { reports, loading: reportsLoading, saveReport } = useReports(user?.id);

  const [result, setResult] = useState<PredictionResult | null>(null);
  const [lastInput, setLastInput] = useState<PredictionInput | null>(null);
  const [predicting, setPredicting] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<string>();
  const [showForm, setShowForm] = useState(true);
  const [clinicalOpen, setClinicalOpen] = useState(false);
  const [creatorOpen, setCreatorOpen] = useState(false);

  const handlePredict = useCallback(async (input: PredictionInput) => {
    setPredicting(true);
    try {
      const res = await calculatePrediction(input);
      setResult(res);
      setLastInput(input);
      setShowForm(false);
      await saveReport(input, res);
    } catch (error) {
      console.error('Prediction error:', error);
    } finally {
      setPredicting(false);
    }
  }, [saveReport]);

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

          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Brain className="w-5 h-5 text-primary" />
          </div>
          <h1 className="font-display font-bold text-lg text-gradient">DharmaAI</h1>
          <span className="text-xs text-muted-foreground hidden lg:block">Appendicitis Prediction Dashboard</span>
        </div>
        
        <div className="flex items-center gap-1 sm:gap-2">
          <GoogleTranslate />
          <ModeToggle />
          
          <Sheet>
            <SheetTrigger asChild>
              <button className="lg:hidden p-2 hover:bg-secondary rounded-lg transition-colors">
                <Settings2 className="w-5 h-5 text-muted-foreground" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="p-0 w-64 border-l-border">
              <RightSidebar
                onDownloadPDF={handleDownloadPDF}
                onClinicalEvidence={() => setClinicalOpen(true)}
                onCreatorInfo={() => setCreatorOpen(true)}
                onSignOut={signOut}
                userEmail={user?.email}
                hasResult={!!result && !!lastInput}
              />
            </SheetContent>
          </Sheet>

          <button className="p-2 hover:bg-secondary rounded-lg transition-colors hidden sm:block">
            <MoreVertical className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebars */}
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
        <main className="flex-1 overflow-y-auto scrollbar-thin p-4 sm:p-6 space-y-5">
          <div className="max-w-2xl mx-auto w-full">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">Prediction Canvas</span>
              <div className="flex items-center gap-2 lg:hidden">
                 {/* Mobile indicators could go here */}
              </div>
            </div>

            {showForm ? (
              <PredictionForm onSubmit={handlePredict} loading={predicting} />
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 sm:space-y-5">
                {result && <DharmaScoreCard result={result} />}
                {result && result.shapValues.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest pl-2">Diagnosis Explanation</h4>
                    <ShapChart shapValues={result.shapValues} />
                  </div>
                )}

                {result && result.complication && result.complication.shapValues.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest pl-2">Complication Explanation</h4>
                    <ShapChart shapValues={result.complication.shapValues} />
                  </div>
                )}

                {result && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-card p-4 sm:p-5"
                  >
                    <p className="text-sm text-secondary-foreground leading-relaxed">
                      The <strong className="text-foreground">Dharma Score</strong> of{' '}
                      <strong className="text-foreground">{result.dharmaScore}%</strong>{' '}
                      indicates a <strong className="text-foreground">{result.resultStatus.toLowerCase()}</strong>.{' '}
                      {result.clinicalNote}
                    </p>
                  </motion.div>
                )}

                {lastInput && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="glass-card overflow-hidden"
                  >
                    <div className="px-5 py-3 border-b border-border bg-sidebar/30 flex items-center gap-2">
                      <Activity className="w-3.5 h-3.5 text-primary" />
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-foreground">Clinical Parameters</h4>
                    </div>
                    <div className="p-4 grid grid-cols-2 xs:grid-cols-3 gap-y-4 gap-x-2">
                       <DataPoint label="Nausea" value={lastInput.nausea ? "Yes" : "No"} highlight={lastInput.nausea} />
                       <DataPoint label="Loss of Appetite" value={lastInput.lossOfAppetite ? "Yes" : "No"} highlight={lastInput.lossOfAppetite} />
                       <DataPoint label="Peritonitis" value={lastInput.peritonitis} highlight={lastInput.peritonitis !== 'none'} />
                       <DataPoint label="WBC" value={lastInput.wbcCount.toString()} />
                       <DataPoint label="Temp" value={`${lastInput.bodyTemperature}°C`} />
                       <DataPoint label="Neutrophil" value={`${lastInput.neutrophilPercentage}%`} />
                       <DataPoint label="CRP" value={lastInput.crp.toString()} />
                       <DataPoint label="Diameter" value={`${lastInput.appendixDiameter}mm`} highlight={lastInput.appendixDiameter > 6} />
                       <DataPoint label="Free Fluids" value={lastInput.freeFluids ? "Present" : "None"} highlight={lastInput.freeFluids} />
                    </div>
                  </motion.div>
                )}

                <button
                  onClick={handleNewPrediction}
                  className="w-full py-3 border border-dashed border-border rounded-lg text-sm text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all font-medium"
                >
                  Run New Prediction
                </button>
              </motion.div>
            )}
          </div>
        </main>

        <aside className="hidden lg:block w-72 flex-shrink-0 border-l border-border">
          <RightSidebar
            onDownloadPDF={handleDownloadPDF}
            onClinicalEvidence={() => setClinicalOpen(true)}
            onCreatorInfo={() => setCreatorOpen(true)}
            onSignOut={signOut}
            userEmail={user?.email}
            hasResult={!!result && !!lastInput}
          />
        </aside>
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
