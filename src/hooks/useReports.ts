import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import type { PredictionInput, PredictionResult } from '@/lib/prediction';

export interface Report {
  id: string;
  created_at: string;
  dharma_score: number;
  result_status: string;
  nausea: boolean;
  loss_of_appetite: boolean;
  peritonitis: string | null;
  urinary_ketones: string | null;
  free_fluids: boolean | null;
  wbc_count: number | null;
  body_temperature: number | null;
  neutrophil_percentage: number | null;
  crp: number | null;
  appendix_diameter: number | null;
  confidence_low: number;
  confidence_high: number;
  clinical_note: string;
  shap_values: any[];
  complication_score?: number;
  complication_status?: string;
  complication_low?: number;
  complication_high?: number;
  complication_note?: string;
}

export function useReports(userId: string | undefined) {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchReports = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const data = await api.get('/reports/');
      setReports(data || []);
    } catch (e) {
      console.error('Failed to fetch reports', e);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const saveReport = async (input: PredictionInput, result: PredictionResult) => {
    if (!userId) return;
    try {
      await api.post('/reports/', {
        nausea: input.nausea,
        loss_of_appetite: input.lossOfAppetite,
        peritonitis: input.peritonitis,
        urinary_ketones: input.urinaryKetones,
        free_fluids: input.freeFluids,
        wbc_count: input.wbcCount,
        body_temperature: input.bodyTemperature,
        neutrophil_percentage: input.neutrophilPercentage,
        crp: input.crp,
        appendix_diameter: input.appendixDiameter,
        dharma_score: result.dharmaScore,
        confidence_low: result.confidenceLow,
        confidence_high: result.confidenceHigh,
        result_status: result.resultStatus,
        clinical_note: result.clinicalNote,
        shap_values: result.shapValues,
        complication_score: result.complication?.probability,
        complication_status: result.complication?.result,
        complication_low: result.complication?.confidenceLow,
        complication_high: result.complication?.confidenceHigh,
        complication_note: result.complication?.note,
      });
      fetchReports();
    } catch (e) {
      console.error('Failed to save report', e);
    }
  };


  return { reports, loading, saveReport, fetchReports };
}
