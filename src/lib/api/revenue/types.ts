export interface RevenueStats {
  daily: number;
  monthly: number;
  yearly: number;
}

export interface RevenueRecord {
  id: string;
  user_id: string;
  member_id: string;
  subscription_id: string;
  amount: number;
  date: string;
  created_at: string;
}