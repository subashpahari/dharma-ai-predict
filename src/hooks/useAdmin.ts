import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Report } from '@/hooks/useReports';

export interface AdminReport extends Report {
  user_id: string;
  user_email?: string;
}

export function useAdmin() {
  const [reports, setReports] = useState<AdminReport[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAllReports = useCallback(async () => {
    setLoading(true);
    // Note: This requires RLS to be disabled or a policy allowing reading all records for admin
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching admin reports:', error);
      setReports([]);
    } else {
      setReports(data as AdminReport[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAllReports();
  }, [fetchAllReports]);

  return { reports, loading, fetchAllReports };
}
