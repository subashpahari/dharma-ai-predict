export interface PredictionInput {
  nausea: number;
  lossOfAppetite: number;
  peritonitis: number;
  urinaryKetones: number | null;
  freeFluids: number | null;
  wbcCount: number;
  bodyTemperature: number;
  neutrophilPercentage: number;
  crp?: number | null;
  appendixDiameter?: number | null;
}

export interface ShapValue {
  feature: string;
  value: number;
  contribution: number;
}

export interface PredictionResult {
  dharmaScore: number;
  confidenceLow: number;
  confidenceHigh: number;
  resultStatus: string;
  clinicalNote: string;
  shapValues: ShapValue[];
  complication?: {
    probability: number;
    confidenceLow: number;
    confidenceHigh: number;
    result: string;
    note: string;
    shapValues: ShapValue[];
  };
}

const BACKEND_URL = typeof import.meta.env.VITE_API_BASE_URL === 'string' 
  ? import.meta.env.VITE_API_BASE_URL 
  : 'http://127.0.0.1:8080';

export async function calculatePrediction(input: PredictionInput): Promise<PredictionResult> {
  const formData = {
    Nausea: input.nausea,
    Loss_of_Appetite: input.lossOfAppetite,
    Peritonitis: input.peritonitis,
    WBC_Count: input.wbcCount,
    Body_Temperature: input.bodyTemperature,
    Neutrophil_Percentage: input.neutrophilPercentage,
    CRP: input.crp,
    Ketones_in_Urine: input.urinaryKetones,
    Appendix_Diameter: input.appendixDiameter,
    Free_Fluids: input.freeFluids,
  };

  try {
    const response = await fetch(`${BACKEND_URL}/api/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error('Prediction request failed');
    }

    const data = await response.json();
    const diag = data.diagnosis;
    const comp = data.complication;
    
    const shapValuesDiag: ShapValue[] = diag.shap_values.map((item: any) => ({
      feature: item.feature,
      value: 0,
      contribution: item.contribution
    })).sort((a: ShapValue, b: ShapValue) => Math.abs(b.contribution) - Math.abs(a.contribution));

    let complicationData = undefined;
    if (comp) {
      const shapValuesComp: ShapValue[] = comp.shap_values.map((item: any) => ({
        feature: item.feature,
        value: 0,
        contribution: item.contribution
      })).sort((a: ShapValue, b: ShapValue) => Math.abs(b.contribution) - Math.abs(a.contribution));

      complicationData = {
        probability: Math.round(comp.probability),
        confidenceLow: Math.round(comp.confidence_interval[0]),
        confidenceHigh: Math.round(comp.confidence_interval[1]),
        result: comp.result,
        note: comp.note,
        shapValues: shapValuesComp
      };
    }

    return {
      dharmaScore: Math.round(diag.probability),
      confidenceLow: Math.round(diag.confidence_interval[0]),
      confidenceHigh: Math.round(diag.confidence_interval[1]),
      resultStatus: diag.result,
      clinicalNote: diag.note,
      shapValues: shapValuesDiag,
      complication: complicationData
    };


  } catch (error) {
    console.error('Error calling prediction API:', error);
    throw error;
  }
}

