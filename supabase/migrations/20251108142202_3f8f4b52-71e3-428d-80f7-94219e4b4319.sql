-- Add swaps_used column to profiles table
ALTER TABLE public.profiles
ADD COLUMN swaps_used integer NOT NULL DEFAULT 0;