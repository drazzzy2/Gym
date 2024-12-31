export interface GymSettings {
  id?: string;
  user_id?: string;
  name: string;
  email: string;
  phone: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  max_capacity: number;
  created_at?: string;
  updated_at?: string;
}