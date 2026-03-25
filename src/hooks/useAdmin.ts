import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
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
    try {
      const data = await api.get('/reports/admin');
      setReports(data || []);
    } catch (e) {
      console.error('Failed to fetch admin reports', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllReports();
  }, [fetchAllReports]);

  return { reports, loading, fetchAllReports };
}
