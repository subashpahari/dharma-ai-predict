import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Brain, Sliders, MoreVertical } from 'lucide-react';
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';
import PredictionForm from '@/components/PredictionForm';
import DharmaScoreCard from '@/components/DharmaScoreCard';
import ShapChart from '@/components/ShapChart';
import ClinicalEvidenceModal from '@/components/ClinicalEvidenceModal';
import CreatorModal from '@/components/CreatorModal';
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
    // Simulate API latency
    await new Promise(r => setTimeout(r, 800));
    const res = calculatePrediction(input);
    setResult(res);
    setLastInput(input);
    setShowForm(false);
    await saveReport(input, res);
    setPredicting(false);
  }, [saveReport]);

  const handleSelectReport = useCallback((report: Report) => {
    setSelectedReportId(report.id);
    setShowForm(false);
    setResult({
      dharmaScore: report.dharma_score,
      confidenceLow: report.confidence_low,
      confidenceHigh: report.confidence_high,
      resultStatus: report.result_status,
      clinicalNote: report.clinical_note,
      shapValues: [], // SHAP values not stored, show empty
    });
    setLastInput({
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
    });
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
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <header className="h-14 border-b border-border flex items-center justify-between px-5 flex-shrink-0 bg-sidebar">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Brain className="w-5 h-5 text-primary" />
          </div>
          <h1 className="font-display font-bold text-lg text-gradient">DharmaAI</h1>
          <span className="text-xs text-muted-foreground hidden sm:block">Appendicitis Prediction Dashboard</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
            <Sliders className="w-4 h-4 text-muted-foreground" />
          </button>
          <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
            <MoreVertical className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </header>

      {/* Three column layout */}
      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar
          reports={reports}
          loading={reportsLoading}
          onSelectReport={handleSelectReport}
          selectedReportId={selectedReportId}
          onNewPrediction={handleNewPrediction}
        />

        {/* Middle Canvas */}
        <main className="flex-1 overflow-y-auto scrollbar-thin p-6 space-y-5">
          <div className="max-w-2xl mx-auto">
            {/* Chat header */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">Prediction Canvas</span>
            </div>

            {showForm ? (
              <PredictionForm onSubmit={handlePredict} loading={predicting} />
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                {result && <DharmaScoreCard result={result} />}
                {result && result.shapValues.length > 0 && <ShapChart shapValues={result.shapValues} />}

                {/* Chat-like explanation */}
                {result && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-card p-5"
                  >
                    <p className="text-sm text-secondary-foreground leading-relaxed">
                      The <strong className="text-foreground">Dharma Score</strong> of{' '}
                      <strong className="text-foreground">{result.dharmaScore}%</strong>{' '}
                      indicates a <strong className="text-foreground">{result.resultStatus.toLowerCase()}</strong>.{' '}
                      {result.clinicalNote}
                    </p>
                  </motion.div>
                )}

                <button
                  onClick={handleNewPrediction}
                  className="w-full py-3 border border-dashed border-border rounded-lg text-sm text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
                >
                  Run New Prediction
                </button>
              </motion.div>
            )}
          </div>
        </main>

        <RightSidebar
          onDownloadPDF={handleDownloadPDF}
          onClinicalEvidence={() => setClinicalOpen(true)}
          onCreatorInfo={() => setCreatorOpen(true)}
          onSignOut={signOut}
          userEmail={user?.email}
          hasResult={!!result && !!lastInput}
        />
      </div>

      <ClinicalEvidenceModal open={clinicalOpen} onClose={() => setClinicalOpen(false)} />
      <CreatorModal open={creatorOpen} onClose={() => setCreatorOpen(false)} />
    </div>
  );
}
