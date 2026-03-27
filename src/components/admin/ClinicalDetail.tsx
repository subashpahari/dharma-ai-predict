import { motion, AnimatePresence } from 'framer-motion';
import { Users, LayoutDashboard, Clock, MoreVertical, Activity, Brain } from 'lucide-react';
import DharmaScoreCard from '@/components/DharmaScoreCard';
import ShapChart from '@/components/ShapChart';
import { AdminReport } from '@/hooks/useAdmin';

interface ClinicalDetailProps {
  selectedReport: AdminReport | null;
}

export function ClinicalDetail({ selectedReport }: ClinicalDetailProps) {
  if (!selectedReport) {
    return (
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
    );
  }

  return (
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
              <h2 className="text-xl font-bold font-display tracking-tight truncate max-w-[200px] sm:max-w-none">
                {selectedReport.user_email || `USER: ${selectedReport.user_id.slice(0, 8)}...`}
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
          shapValues: selectedReport.shap_values || [],
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

      {/* SHAP Analysis (New for Admin) */}
      {selectedReport.shap_values && selectedReport.shap_values.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest pl-2 flex items-center gap-2">
            <Brain className="w-3.5 h-3.5 text-coral" /> Diagnosis Interpretation (SHAP)
          </h4>
          <ShapChart shapValues={selectedReport.shap_values} />
        </div>
      )}

      {/* Patient Profile */}
      <div className="glass-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border bg-sidebar/30 flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          <h4 className="text-xs font-bold uppercase tracking-widest text-foreground">Clinical Parameters Submitted</h4>
        </div>
        <div className="p-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          <DataPoint label="Nausea" value={selectedReport.nausea ? "Positive" : "Negative"} highlight={selectedReport.nausea} />
          <DataPoint label="Loss of Appetite" value={selectedReport.loss_of_appetite ? "Positive" : "Negative"} highlight={selectedReport.loss_of_appetite} />
          <DataPoint label="Peritonitis" value={selectedReport.peritonitis || 'None'} highlight={selectedReport.peritonitis !== 'none' && !!selectedReport.peritonitis} />
          <DataPoint label="WBC Count" value={selectedReport.wbc_count?.toString() || 'N/A'} />
          <DataPoint label="Temperature" value={selectedReport.body_temperature ? `${selectedReport.body_temperature}°C` : 'N/A'} />
          <DataPoint label="Neutrophil" value={selectedReport.neutrophil_percentage ? `${selectedReport.neutrophil_percentage}%` : 'N/A'} />
          <DataPoint label="CRP" value={selectedReport.crp?.toString() || 'N/A'} />
          <DataPoint label="Diameter" value={selectedReport.appendix_diameter ? `${selectedReport.appendix_diameter}mm` : 'N/A'} highlight={(selectedReport.appendix_diameter || 0) > 6} />
          <DataPoint label="Free Fluids" value={selectedReport.free_fluids ? "Present" : "None"} highlight={selectedReport.free_fluids} />
          <DataPoint label="Urinary Ketones" value={selectedReport.urinary_ketones || 'None'} highlight={selectedReport.urinary_ketones !== 'none' && !!selectedReport.urinary_ketones} />
        </div>
      </div>

      <div className="flex items-center justify-center py-4">
         <div className="h-px bg-border flex-1" />
         <div className="w-2 h-2 rounded-full border border-border mx-4" />
         <div className="h-px bg-border flex-1" />
      </div>
    </motion.div>
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
