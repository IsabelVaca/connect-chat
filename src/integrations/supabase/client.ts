import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://oiygxqcnuwumbihmwimi.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_kfm8fTPRWWyAP9prZT9KzA_NXg8OxHq";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export type Lifestyle = {
  sleepSchedule?: string;
  cleanliness?: string;
  socialLevel?: string;
  guests?: string;
  budget?: number;
};

export type ProfileRow = {
  id: string;
  name: string | null;
  age: number | null;
  city: string | null;
  avatar_url: string | null;
  bio: string | null;
  interests: string[] | null;
  lifestyle: Lifestyle | null;
};
