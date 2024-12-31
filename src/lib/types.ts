// ... existing types ...

export interface CheckIn {
  id: string;
  member_id: string;
  check_in_time: string;
  check_out_time: string | null;
  member?: Member;
}

// Update existing Member interface to include unique_id
export interface Member {
  id: string;
  user_id: string;
  unique_id: string;
  subscription_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  start_date: string;
  end_date: string;
  status: 'active' | 'inactive' | 'expired';
  created_at: string;
  updated_at: string;
  subscription?: Subscription;
}