import { supabase } from '../supabase';

interface RevenueStats {
  daily: number;
  monthly: number;
  yearly: number;
}

export async function getRevenueStats(): Promise<RevenueStats> {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const firstDayOfYear = new Date(today.getFullYear(), 0, 1);

  const { data, error } = await supabase
    .from('revenue_history')
    .select('amount, date')
    .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

  if (error) throw error;

  const revenue = data.reduce((acc, record) => {
    const recordDate = new Date(record.date);
    
    // Daily revenue (today)
    if (recordDate.toDateString() === today.toDateString()) {
      acc.daily += record.amount;
    }
    
    // Monthly revenue (current month)
    if (recordDate >= firstDayOfMonth) {
      acc.monthly += record.amount;
    }
    
    // Yearly revenue (current year)
    if (recordDate >= firstDayOfYear) {
      acc.yearly += record.amount;
    }

    return acc;
  }, { daily: 0, monthly: 0, yearly: 0 });

  return revenue;
}