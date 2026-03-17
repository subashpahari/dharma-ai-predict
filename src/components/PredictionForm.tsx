import { useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Loader2,
  Thermometer,
  Droplets,
  CircleDot,
} from "lucide-react";
import type { PredictionInput } from "@/lib/prediction";

interface PredictionFormProps {
  onSubmit: (input: PredictionInput) => void;
  loading: boolean;
}

// ✅ allow empty string for inputs
type FormState = {
  nausea: boolean | null;
  lossOfAppetite: boolean | null;
  peritonitis: "none" | "local" | "generalized" | null;
  urinaryKetones: "none" | "trace" | "small" | "moderate" | "large" | null;
  freeFluids: boolean | null;
  wbcCount: string;
  bodyTemperature: string;
  neutrophilPercentage: string;
  crp: string;
  appendixDiameter: string;
};

export default function PredictionForm({
  onSubmit,
  loading,
}: PredictionFormProps) {
  const [form, setForm] = useState<FormState>({
    nausea: null,
    lossOfAppetite: null,
    peritonitis: null,
    urinaryKetones: null,
    freeFluids: null,
    wbcCount: "",
    bodyTemperature: "",
    neutrophilPercentage: "",
    crp: "",
    appendixDiameter: "",
  });
  const [error, setError] = useState<string | null>(null);

  const selectClass =
    "w-full py-3 px-4 bg-secondary border border-border rounded-xl text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none";

  const inputClass =
    "w-full py-3 px-4 bg-secondary border border-border rounded-xl text-base text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all";

  const labelClass =
    "text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2 block ml-1";

  const handleNumberChange = (key: keyof FormState, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      form.bodyTemperature === "" ||
      form.wbcCount === "" ||
      form.neutrophilPercentage === "" ||
      form.nausea === null ||
      form.lossOfAppetite === null ||
      form.peritonitis === null
    ) {
      setError("Please fill all required fields");
      return;
    }

    const temp = Number(form.bodyTemperature);
    const wbc = Number(form.wbcCount);
    const neutro = Number(form.neutrophilPercentage);

    // ✅ range validation
    if (temp < 35 || temp > 42) {
      setError("Temperature must be between 35–42°C");
      return;
    }

    if (wbc < 10 || wbc > 100) {
      setError("WBC count must be between 10–100 (10³/µL)");
      return;
    }

    if (neutro < 0 || neutro > 100) {
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
      urinaryKetones:
        form.urinaryKetones === null ? null : ketoneMap[form.urinaryKetones],
      freeFluids: form.freeFluids === null ? null : form.freeFluids ? 1 : 0,
      wbcCount: Number(form.wbcCount),
      bodyTemperature: Number(form.bodyTemperature),
      neutrophilPercentage: Number(form.neutrophilPercentage),
      crp: form.crp === "" ? null : Number(form.crp),
      appendixDiameter:
        form.appendixDiameter === "" ? null : Number(form.appendixDiameter),
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
            value={form.nausea === null ? "null" : form.nausea ? "yes" : "no"}
            onChange={(e) =>
              setForm({
                ...form,
                nausea:
                  e.target.value === "null" ? null : e.target.value === "yes",
              })
            }
            className={selectClass}
          >
            <option value="null">Select Option</option>
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Loss of Appetite *</label>
          <select
            value={
              form.lossOfAppetite === null
                ? "null"
                : form.lossOfAppetite
                  ? "yes"
                  : "no"
            }
            onChange={(e) =>
              setForm({
                ...form,
                lossOfAppetite:
                  e.target.value === "null" ? null : e.target.value === "yes",
              })
            }
            className={selectClass}
          >
            <option value="null">Select Option</option>
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Peritonitis *</label>
          <select
            value={form.peritonitis || "null"}
            onChange={(e) =>
              setForm({
                ...form,
                peritonitis:
                  e.target.value === "null" ? null : (e.target.value as any),
              })
            }
            className={selectClass}
          >
            <option value="null">Select Option</option>
            <option value="none">None</option>
            <option value="local">Local</option>
            <option value="generalized">Generalized</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Urinary Ketones</label>
          <select
            value={form.urinaryKetones || "null"}
            onChange={(e) =>
              setForm({
                ...form,
                urinaryKetones:
                  e.target.value === "null" ? null : (e.target.value as any),
              })
            }
            className={selectClass}
          >
            <option value="null">Select Option</option>
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
            type="text"
            inputMode="decimal"
            value={form.bodyTemperature}
            placeholder="37"
            onChange={(e) =>
              handleNumberChange("bodyTemperature", e.target.value)
            }
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>
            <Droplets className="w-3 h-3 inline mr-1" />
            WBC Count (10³/µL) *
          </label>
          <input
            type="text"
            inputMode="decimal"
            value={form.wbcCount}
            placeholder="20"
            onChange={(e) => handleNumberChange("wbcCount", e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>
            <CircleDot className="w-3 h-3 inline mr-1" />
            Neutrophil (%) *
          </label>
          <input
            type="text"
            inputMode="decimal"
            value={form.neutrophilPercentage}
            placeholder="70"
            onChange={(e) =>
              handleNumberChange("neutrophilPercentage", e.target.value)
            }
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>CRP (mg/L)</label>
          <input
            type="text"
            inputMode="decimal"
            value={form.crp}
            placeholder="15"
            onChange={(e) => handleNumberChange("crp", e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Free Fluids</label>
          <select
            value={
              form.freeFluids === null ? "null" : form.freeFluids ? "yes" : "no"
            }
            onChange={(e) =>
              setForm({
                ...form,
                freeFluids:
                  e.target.value === "null" ? null : e.target.value === "yes",
              })
            }
            className={selectClass}
          >
            <option value="null">Select Option</option>
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </div>

        <div className="sm:col-span-1">
          <label className={labelClass}>Appendix Diameter (mm)</label>
          <input
            type="text"
            inputMode="decimal"
            value={form.appendixDiameter}
            placeholder="6"
            onChange={(e) =>
              handleNumberChange("appendixDiameter", e.target.value)
            }
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
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Activity className="w-4 h-4" />
        )}
        Run Analysis
      </button>
    </motion.form>
  );
}
