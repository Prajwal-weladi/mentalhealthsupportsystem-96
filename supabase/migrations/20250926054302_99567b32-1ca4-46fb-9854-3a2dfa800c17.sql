-- Add missing columns to journal_entries table
ALTER TABLE public.journal_entries 
ADD COLUMN IF NOT EXISTS energy_level integer DEFAULT 5,
ADD COLUMN IF NOT EXISTS entry_date date DEFAULT CURRENT_DATE;