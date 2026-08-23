// Connects the app to Supabase. Every page imports this.

import { createClient } from "@supabase/supabase-js";

// Keys come from .env so they stay out of the code.
const URL = import.meta.env.VITE_SUPABASE_URL;
const API_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(URL, API_KEY);
