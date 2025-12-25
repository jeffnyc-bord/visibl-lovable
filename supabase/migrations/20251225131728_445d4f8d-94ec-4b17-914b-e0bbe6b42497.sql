-- Update the subscription_tier enum to use starter instead of free
ALTER TYPE public.subscription_tier RENAME VALUE 'free' TO 'starter';

-- Add articles_used column to profiles for AEO content studio tracking
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS articles_used integer NOT NULL DEFAULT 0;

-- Add prompts_used column to profiles for prompt blast lab tracking
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS prompts_used integer NOT NULL DEFAULT 0;

-- Add chatbots_tracked column to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS chatbots_tracked integer NOT NULL DEFAULT 0;