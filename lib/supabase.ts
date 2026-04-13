import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// For server-side operations with service role key
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
export const supabaseServer = createClient(supabaseUrl, supabaseServiceKey);

// Types for our database tables
export interface Person {
  id: string;
  name: string;
  bio: string;
  expertise: string[];
  github_url?: string;
  twitter_url?: string;
  linkedin_url?: string;
  profile_image_url?: string;
  followers_count: number;
  contributions_count: number;
  created_at: string;
  updated_at: string;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  url: string;
  difficulty?: string;
  tags: string[];
  rating: number;
  reviews_count: number;
  created_at: string;
  updated_at: string;
}

export interface Blog {
  id: string;
  title: string;
  content: string;
  author_id: string;
  category: string;
  tags: string[];
  published: boolean;
  likes_count: number;
  views_count: number;
  created_at: string;
  updated_at: string;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  category: string;
  platform_url: string;
  members_count: number;
  tags: string[];
  type: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}
