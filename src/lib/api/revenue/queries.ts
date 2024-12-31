import { supabase } from '../../supabase';
import { RevenueStats, RevenueRecord } from './types';

export async function fetchRevenueHistory(): Promise<RevenueRecord[]> {
  const { data, error } = await supabase
    .from('revenue_history')
    .select('*')
    .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
    .order('date', { ascending: false });

  if (error) throw error;
  return data;
}

export async function calculateRevenueStats(): Promise<RevenueStats> {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const firstDayOfYear = new Date(today.getFullYear(), 0, 1);

  const { data, error } = await supabase
    .from('revenue_history')
    .select('amount, date')
    .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

  if (error) throw error;

  return data.reduce((acc, record) => {
    const recordDate = new Date(record.date);
    
    if (recordDate.toDateString() === today.toDateString()) {
      acc.daily += record.amount;
    }
    if (recordDate >= firstDayOfMonth) {
      acc.monthly += record.amount;
    }
    if (recordDate >= firstDayOfYear) {
      acc.yearly += record.amount;
    }

    return acc;
  }, { daily: 0, monthly: 0, yearly: 0 });
}