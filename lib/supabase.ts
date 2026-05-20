import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a single supabase client for client and server actions
export const supabase = createClient(
  supabaseUrl || 'https://mock-supabase-url.supabase.co',
  supabaseAnonKey || 'mock-anon-key'
);

/*
========================================================================
SQL DATABASE MIGRATION SCRIPT (POSTGRES / SUPABASE)
========================================================================
Run this exact query inside your Supabase SQL Editor to set up the backend database:

-- Create audits database table
CREATE TABLE IF NOT EXISTS public.audits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    email TEXT NOT NULL,
    company_name TEXT,
    role TEXT,
    team_size INTEGER NOT NULL,
    primary_use_case TEXT NOT NULL,
    total_monthly_spend NUMERIC(10, 2) NOT NULL,
    total_monthly_savings NUMERIC(10, 2) NOT NULL,
    total_annual_savings NUMERIC(10, 2) NOT NULL,
    savings_tier TEXT NOT NULL,
    raw_input JSONB NOT NULL,
    is_contacted BOOLEAN DEFAULT FALSE NOT NULL
);

-- Enable Row-Level Security (RLS)
ALTER TABLE public.audits ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous inserts (lead capture form)
CREATE POLICY "Allow public insert to audits" 
ON public.audits 
FOR INSERT 
WITH CHECK (true);

-- Create policy to allow anonymous reads by ID (share results page)
CREATE POLICY "Allow public select by id" 
ON public.audits 
FOR SELECT 
USING (true);

-- Create an index on id for fast share link lookups
CREATE INDEX IF NOT EXISTS audits_id_idx ON public.audits (id);
========================================================================
*/
