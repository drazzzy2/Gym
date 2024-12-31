import { useState, useEffect } from 'react';
import { getRevenueStats } from '@/lib/api/revenue';
import { useToast } from './use-toast';
import type { RevenueStats } from '@/lib/api/revenue/types';

interface UseRevenueStatsReturn {
  stats: RevenueStats;
  isLoading: boolean;
  refresh: () => Promise<void>;
}

export function useRevenueStats(): UseRevenueStatsReturn {
  const [stats, setStats] = useState<RevenueStats>({ daily: 0, monthly: 0, yearly: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadStats = async () => {
    try {
      const data = await getRevenueStats();
      setStats(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error loading revenue stats",
        description: "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, [toast]);

  return { 
    stats, 
    isLoading,
    refresh: loadStats
  };
}