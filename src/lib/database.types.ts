export interface Database {
  public: {
    Tables: {
      members: {
        Row: {
          id: string;
          user_id: string;
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
          unique_id: string;
        };
        Insert: Omit<Database['public']['Tables']['members']['Row'], 'id' | 'created_at' | 'updated_at' | 'unique_id'>;
        Update: Partial<Database['public']['Tables']['members']['Insert']>;
      };
      subscriptions: {
        Row: {
          id: string;
          name: string;
          price: number;
          description: string | null;
          duration_months: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['subscriptions']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['subscriptions']['Insert']>;
      };
      check_ins: {
        Row: {
          id: string;
          member_id: string;
          check_in_time: string;
          check_out_time: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['check_ins']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['check_ins']['Insert']>;
      };
    };
  };
}