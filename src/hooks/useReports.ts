import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { PredictionInput, PredictionResult } from '@/lib/prediction';

export interface Report {
  id: string;
  created_at: string;
  dharma_score: number;
  result_status: string;
  nausea: boolean;
  loss_of_appetite: boolean;
  peritonitis: string;
  urinary_ketones: string;
  free_fluids: boolean;
  wbc_count: number;
  body_temperature: number;
  neutrophil_percentage: number;
  crp: number;
  appendix_diameter: number;
  confidence_low: number;
  confidence_high: number;
  clinical_note: string;
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
    const { data } = await supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
    setReports((data as Report[]) || []);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const saveReport = async (input: PredictionInput, result: PredictionResult) => {
    if (!userId) return;
    await supabase.from('reports').insert({
      user_id: userId,
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
      complication_score: result.complication?.probability,
      complication_status: result.complication?.result,
      complication_low: result.complication?.confidenceLow,
      complication_high: result.complication?.confidenceHigh,
      complication_note: result.complication?.note,
    });
    fetchReports();
  };


  return { reports, loading, saveReport, fetchReports };
}
