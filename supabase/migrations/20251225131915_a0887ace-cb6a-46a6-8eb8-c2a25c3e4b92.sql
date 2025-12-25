-- Update the handle_new_user function to use 'starter' instead of 'free'
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, subscription_tier, products_tracked, articles_used, prompts_used, chatbots_tracked)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'starter',
    0,
    0,
    0,
    0
  );
  RETURN NEW;
END;
$function$;