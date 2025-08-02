-- Remove problematic columns that don't exist and fix the query structure
-- Add pin_code to reservations table if needed
ALTER TABLE public.reservations 
ADD COLUMN IF NOT EXISTS pin_code TEXT;

-- Update reservations to use ref_code instead of pin_code for existing data
UPDATE public.reservations 
SET pin_code = ref_code 
WHERE pin_code IS NULL AND ref_code IS NOT NULL;