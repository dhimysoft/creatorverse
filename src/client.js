// client.js - Creates the one Supabase connection that every page imports.
import { createClient } from "@supabase/supabase-js";

// Read from .env so the keys are never written into the source code.
const URL = import.meta.env.VITE_SUPABASE_URL;
const API_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Exported so any page can do: import { supabase } from "../client.js";
export const supabase = createClient(URL, API_KEY);
