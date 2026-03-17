import { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Loader2, Thermometer, Droplets, CircleDot } from 'lucide-react';
import type { PredictionInput } from '@/lib/prediction';

interface PredictionFormProps {
  onSubmit: (input: PredictionInput) => void;
  loading: boolean;
}

// ✅ allow empty string for inputs
type FormState = {
  nausea: boolean;
  lossOfAppetite: boolean;
  peritonitis: 'none' | 'local' | 'generalized';
  urinaryKetones: 'none' | 'trace' | 'small' | 'moderate' | 'large';
  freeFluids: boolean | null;
  wbcCount: number | '';
  bodyTemperature: number | '';
  neutrophilPercentage: number | '';
  crp: number | '';
  appendixDiameter: number | '';
};

export default function PredictionForm({ onSubmit, loading }: PredictionFormProps) {
  const [form, setForm] = useState<FormState>({
    nausea: false,
    lossOfAppetite: false,
    peritonitis: 'none',
    urinaryKetones: 'none',
    freeFluids: false,
    wbcCount: 10,
    bodyTemperature: 37,
    neutrophilPercentage: 70,
    crp: 15,
    appendixDiameter: 6,
  });
  const [error, setError] = useState<string | null>(null);

  const selectClass =
    "w-full py-2.5 px-3 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary appearance-none";

  const inputClass =
    "w-full py-2.5 px-3 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary";

  const labelClass =
    "text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block";

  const handleNumberChange = (key: keyof FormState, value: string) => {
    setForm(prev => ({
      ...prev,
      [key]: value === '' ? '' : Number(value)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ required validation
    if (
      form.bodyTemperature === '' ||
      form.wbcCount === '' ||
      form.neutrophilPercentage === ''
    ) {
      setError("Please fill all required fields");
      return;
    }

    // ✅ range validation
    if (form.bodyTemperature < 35 || form.bodyTemperature > 42) {
      setError("Temperature must be between 35–42°C");
      return;
    }

    if (form.wbcCount <= 0) {
      setError("WBC must be greater than 0");
      return;
    }

    if (form.neutrophilPercentage < 0 || form.neutrophilPercentage > 100) {
      setError("Neutrophil % must be between 0–100");
      return;
    }

    setError(null);

    const peritonitisMap = { none: 0, local: 1, generalized: 2 };
    const ketoneMap = { none: 0, trace: 0, small: 1, moderate: 2, large: 3 };

    // ✅ convert to proper numeric types for backend
    const submissionInput: PredictionInput = {
      nausea: form.nausea ? 1 : 0,
      lossOfAppetite: form.lossOfAppetite ? 1 : 0,
      peritonitis: peritonitisMap[form.peritonitis],
      urinaryKetones: ketoneMap[form.urinaryKetones],
      freeFluids: form.freeFluids === null ? null : (form.freeFluids ? 1 : 0),
      wbcCount: Number(form.wbcCount),
      bodyTemperature: Number(form.bodyTemperature),
      neutrophilPercentage: Number(form.neutrophilPercentage),
      crp: form.crp === '' ? null : Number(form.crp),
      appendixDiameter: form.appendixDiameter === '' ? null : Number(form.appendixDiameter),
    };

    console.log("🚀 FINAL DATA SENT TO BACKEND:", submissionInput);
    onSubmit(submissionInput);
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
        <h3 className="font-display font-semibold text-foreground">
          Clinical Parameters
        </h3>
      </div>

      {/* Selects */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Nausea *</label>
          <select
            value={form.nausea ? 'yes' : 'no'}
            onChange={(e) =>
              setForm({ ...form, nausea: e.target.value === 'yes' })
            }
            className={selectClass}
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Loss of Appetite *</label>
          <select
            value={form.lossOfAppetite ? 'yes' : 'no'}
            onChange={(e) =>
              setForm({ ...form, lossOfAppetite: e.target.value === 'yes' })
            }
            className={selectClass}
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Peritonitis *</label>
          <select
            value={form.peritonitis}
            onChange={(e) =>
              setForm({ ...form, peritonitis: e.target.value as any })
            }
            className={selectClass}
          >
            <option value="none">None</option>
            <option value="local">Local</option>
            <option value="generalized">Generalized</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Urinary Ketones</label>
          <select
            value={form.urinaryKetones}
            onChange={(e) =>
              setForm({ ...form, urinaryKetones: e.target.value as any })
            }
            className={selectClass}
          >
            <option value="none">None</option>
            <option value="trace">Trace</option>
            <option value="small">1+</option>
            <option value="moderate">2+</option>
            <option value="large">3+</option>
          </select>
        </div>
      </div>

      {/* Numbers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>
            <Thermometer className="w-3 h-3 inline mr-1" />
            Temperature (°C) *
          </label>
          <input
            type="number"
            step="0.1"
            value={form.bodyTemperature}
            onChange={(e) => handleNumberChange('bodyTemperature', e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>
            <Droplets className="w-3 h-3 inline mr-1" />
            WBC Count *
          </label>
          <input
            type="number"
            step="0.1"
            value={form.wbcCount}
            onChange={(e) => handleNumberChange('wbcCount', e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>
            <CircleDot className="w-3 h-3 inline mr-1" />
            Neutrophil (%) *
          </label>
          <input
            type="number"
            step="0.1"
            value={form.neutrophilPercentage}
            onChange={(e) => handleNumberChange('neutrophilPercentage', e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>CRP (mg/L)</label>
          <input
            type="number"
            step="0.1"
            value={form.crp}
            onChange={(e) => handleNumberChange('crp', e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Free Fluids</label>
          <select
            value={form.freeFluids ? 'yes' : 'no'}
            onChange={(e) =>
              setForm({ ...form, freeFluids: e.target.value === 'yes' })
            }
            className={selectClass}
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </div>

        <div className="sm:col-span-1">
          <label className={labelClass}>Appendix Diameter (mm)</label>
          <input
            type="number"
            step="0.1"
            value={form.appendixDiameter}
            onChange={(e) => handleNumberChange('appendixDiameter', e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Activity className="w-4 h-4" />}
        Run Analysis
      </button>
    </motion.form>
  );
}