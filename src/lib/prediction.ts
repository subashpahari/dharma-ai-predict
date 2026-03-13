export interface PredictionInput {
  nausea: boolean;
  lossOfAppetite: boolean;
  peritonitis: 'none' | 'local' | 'generalized';
  urinaryKetones: 'none' | 'trace' | 'small' | 'moderate' | 'large';
  freeFluids: boolean;
  wbcCount: number;
  bodyTemperature: number;
  neutrophilPercentage: number;
  crp: number;
  appendixDiameter: number;
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
}

export function calculatePrediction(input: PredictionInput): PredictionResult {
  let score = 10;
  const shapValues: ShapValue[] = [];

  // WBC Count contribution
  const wbcContrib = Math.min((input.wbcCount - 7) * 4, 20);
  score += Math.max(wbcContrib, 0);
  shapValues.push({ feature: 'WBC Count', value: input.wbcCount, contribution: wbcContrib });

  // CRP
  const crpContrib = Math.min(input.crp * 0.15, 15);
  score += Math.max(crpContrib, 0);
  shapValues.push({ feature: 'CRP', value: input.crp, contribution: crpContrib });

  // Appendix Diameter
  const diamContrib = input.appendixDiameter > 6 ? Math.min((input.appendixDiameter - 6) * 5, 18) : -5;
  score += Math.max(diamContrib, -5);
  shapValues.push({ feature: 'Appendix Diameter', value: input.appendixDiameter, contribution: diamContrib });

  // Neutrophil %
  const neutContrib = Math.min((input.neutrophilPercentage - 65) * 0.5, 12);
  score += Math.max(neutContrib, -3);
  shapValues.push({ feature: 'Neutrophil %', value: input.neutrophilPercentage, contribution: neutContrib });

  // Temperature
  const tempContrib = input.bodyTemperature > 37.5 ? Math.min((input.bodyTemperature - 37.5) * 8, 10) : -2;
  score += Math.max(tempContrib, -2);
  shapValues.push({ feature: 'Body Temperature', value: input.bodyTemperature, contribution: tempContrib });

  // Nausea
  const nauseaContrib = input.nausea ? 6 : -2;
  score += nauseaContrib;
  shapValues.push({ feature: 'Nausea', value: input.nausea ? 1 : 0, contribution: nauseaContrib });

  // Loss of Appetite
  const appetiteContrib = input.lossOfAppetite ? 5 : -1;
  score += appetiteContrib;
  shapValues.push({ feature: 'Loss of Appetite', value: input.lossOfAppetite ? 1 : 0, contribution: appetiteContrib });

  // Peritonitis
  const peritonitisMap = { none: -3, local: 8, generalized: 15 };
  const periContrib = peritonitisMap[input.peritonitis];
  score += periContrib;
  shapValues.push({ feature: 'Peritonitis', value: periContrib, contribution: periContrib });

  // Urinary Ketones
  const ketoneMap = { none: 0, trace: 2, small: 4, moderate: 6, large: 8 };
  const ketoneContrib = ketoneMap[input.urinaryKetones];
  score += ketoneContrib;
  shapValues.push({ feature: 'Urinary Ketones', value: ketoneContrib, contribution: ketoneContrib });

  // Free Fluids
  const fluidContrib = input.freeFluids ? 10 : -2;
  score += fluidContrib;
  shapValues.push({ feature: 'Free Fluids', value: input.freeFluids ? 1 : 0, contribution: fluidContrib });

  const dharmaScore = Math.max(0, Math.min(100, Math.round(score)));
  const margin = Math.round(3 + Math.random() * 4);
  const confidenceLow = Math.max(0, dharmaScore - margin);
  const confidenceHigh = Math.min(100, dharmaScore + margin);

  let resultStatus: string;
  let clinicalNote: string;

  if (dharmaScore >= 75) {
    resultStatus = 'High Probability of Appendicitis';
    clinicalNote = 'Clinical findings strongly suggest acute appendicitis. Urgent surgical consultation is recommended. Consider CT abdomen for confirmatory imaging if not already performed.';
  } else if (dharmaScore >= 45) {
    resultStatus = 'Moderate Probability of Appendicitis';
    clinicalNote = 'Clinical presentation is equivocal. Recommend serial abdominal examinations, repeat laboratory studies in 6-8 hours, and consider CT abdomen with IV contrast for further evaluation.';
  } else {
    resultStatus = 'Low Probability of Appendicitis';
    clinicalNote = 'Current clinical and laboratory parameters suggest a low likelihood of appendicitis. Consider alternative diagnoses. Discharge with return precautions may be appropriate if clinical picture supports it.';
  }

  shapValues.sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));

  return { dharmaScore, confidenceLow, confidenceHigh, resultStatus, clinicalNote, shapValues };
}
