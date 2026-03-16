import { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Loader2, Thermometer, Droplets, CircleDot } from 'lucide-react';
import type { PredictionInput } from '@/lib/prediction';

interface PredictionFormProps {
  onSubmit: (input: PredictionInput) => void;
  loading: boolean;
}

export default function PredictionForm({ onSubmit, loading }: PredictionFormProps) {
  const [form, setForm] = useState<PredictionInput>({
    nausea: false,
    lossOfAppetite: false,
    peritonitis: 'none',
    urinaryKetones: 'none',
    freeFluids: false,
    wbcCount: 10,
    bodyTemperature: 37.0,
    neutrophilPercentage: 70,
    crp: 15,
    appendixDiameter: 6,
  });

  const selectClass = "w-full py-2.5 px-3 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary appearance-none";
  const inputClass = "w-full py-2.5 px-3 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary";
  const labelClass = "text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="glass-card p-6 space-y-5"
    >
      <div className="flex items-center gap-2 mb-2">
        <Activity className="w-5 h-5 text-primary" />
        <h3 className="font-display font-semibold text-foreground">Clinical Parameters</h3>
      </div>

      {/* Select inputs - 1 column mobile, 2 column desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Nausea</label>
          <select value={form.nausea ? 'yes' : 'no'} onChange={e => setForm({ ...form, nausea: e.target.value === 'yes' })} className={selectClass}>
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Loss of Appetite</label>
          <select value={form.lossOfAppetite ? 'yes' : 'no'} onChange={e => setForm({ ...form, lossOfAppetite: e.target.value === 'yes' })} className={selectClass}>
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Peritonitis</label>
          <select value={form.peritonitis} onChange={e => setForm({ ...form, peritonitis: e.target.value as any })} className={selectClass}>
            <option value="none">None</option>
            <option value="local">Local</option>
            <option value="generalized">Generalized</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Urinary Ketones</label>
          <select value={form.urinaryKetones} onChange={e => setForm({ ...form, urinaryKetones: e.target.value as any })} className={selectClass}>
            <option value="none">None</option>
            <option value="trace">Trace</option>
            <option value="small">1+</option>
            <option value="moderate">2+</option>
            <option value="large">3+</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Free Fluids</label>
          <select value={form.freeFluids ? 'yes' : 'no'} onChange={e => setForm({ ...form, freeFluids: e.target.value === 'yes' })} className={selectClass}>
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </div>
      </div>

      {/* Number inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}><Droplets className="w-3 h-3 inline mr-1" />WBC Count (10³/μL)</label>
          <input type="number" step="0.1" min="0" max="50" value={form.wbcCount} onChange={e => setForm({ ...form, wbcCount: +e.target.value })} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}><Thermometer className="w-3 h-3 inline mr-1" />Temperature (°C)</label>
          <input type="number" step="0.1" min="35" max="42" value={form.bodyTemperature} onChange={e => setForm({ ...form, bodyTemperature: +e.target.value })} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}><CircleDot className="w-3 h-3 inline mr-1" />Neutrophil (%)</label>
          <input type="number" step="0.1" min="0" max="100" value={form.neutrophilPercentage} onChange={e => setForm({ ...form, neutrophilPercentage: +e.target.value })} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>CRP (mg/L)</label>
          <input type="number" step="0.1" min="0" max="500" value={form.crp} onChange={e => setForm({ ...form, crp: +e.target.value })} className={inputClass} />
        </div>
        <div className="sm:col-span-2">

          <label className={labelClass}>Appendix Diameter (mm)</label>
          <input type="number" step="0.1" min="0" max="30" value={form.appendixDiameter} onChange={e => setForm({ ...form, appendixDiameter: +e.target.value })} className={inputClass} />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 glow-primary"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Activity className="w-4 h-4" />}
        Run Prediction
      </button>
    </motion.form>
  );
}
