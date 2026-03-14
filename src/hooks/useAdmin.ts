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
    
    // 1. Fetch all profiles (User Directory)
    const { data: profiles, error: pError } = await supabase
      .from('profiles')
      .select('user_id, email');

    // 2. Fetch all reports
    const { data: allReports, error: rError } = await supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (pError || rError) {
      console.error('Data fetch error:', pError || rError);
      // Fallback: If profiles fails, still show reports with IDs
      if (allReports) {
        setReports(allReports as AdminReport[]);
      }
    } else {
      // 3. Map reports to include emails from profiles
      const emailMap = (profiles || []).reduce((acc, p) => {
        acc[p.user_id] = p.email;
        return acc;
      }, {} as Record<string, string>);

      const formattedReports = (allReports || []).map(report => ({
        ...report,
        user_email: emailMap[report.user_id] || report.user_id
      }));

      setReports(formattedReports as AdminReport[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAllReports();
  }, [fetchAllReports]);

  return { reports, loading, fetchAllReports };
}
