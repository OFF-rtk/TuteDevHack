import { User as SupabaseUser } from '@supabase/supabase-js';

// Define our custom profile fields separately
type CustomProfile = {
  role?: string;
  area_name?: string;
  full_name?: string;
};

// Our final user type is an intersection of the original and our custom profile
export type CustomUser = SupabaseUser & CustomProfile;

declare module 'express' {
  interface Request {
    user?: CustomUser;
  }
}