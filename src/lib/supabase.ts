import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          role: 'ATHLETE' | 'COACH' | 'SCOUT' | 'ADMIN';
          created_at: string;
          last_active: string;
          email_verified: boolean;
          onboarding_completed: boolean;
        };
        Insert: {
          id?: string;
          email: string;
          role?: 'ATHLETE' | 'COACH' | 'SCOUT' | 'ADMIN';
          created_at?: string;
          last_active?: string;
          email_verified?: boolean;
          onboarding_completed?: boolean;
        };
        Update: {
          id?: string;
          email?: string;
          role?: 'ATHLETE' | 'COACH' | 'SCOUT' | 'ADMIN';
          created_at?: string;
          last_active?: string;
          email_verified?: boolean;
          onboarding_completed?: boolean;
        };
      };
    };
  };
};
