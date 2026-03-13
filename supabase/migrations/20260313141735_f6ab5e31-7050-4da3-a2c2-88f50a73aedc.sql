
-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create reports table
CREATE TABLE public.reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  nausea BOOLEAN NOT NULL DEFAULT false,
  loss_of_appetite BOOLEAN NOT NULL DEFAULT false,
  peritonitis TEXT NOT NULL DEFAULT 'none',
  urinary_ketones TEXT NOT NULL DEFAULT 'none',
  free_fluids BOOLEAN NOT NULL DEFAULT false,
  wbc_count NUMERIC NOT NULL DEFAULT 0,
  body_temperature NUMERIC NOT NULL DEFAULT 36.5,
  neutrophil_percentage NUMERIC NOT NULL DEFAULT 0,
  crp NUMERIC NOT NULL DEFAULT 0,
  appendix_diameter NUMERIC NOT NULL DEFAULT 0,
  dharma_score NUMERIC NOT NULL DEFAULT 0,
  confidence_low NUMERIC NOT NULL DEFAULT 0,
  confidence_high NUMERIC NOT NULL DEFAULT 0,
  result_status TEXT NOT NULL DEFAULT '',
  clinical_note TEXT NOT NULL DEFAULT ''
);

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own reports" ON public.reports FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own reports" ON public.reports FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own reports" ON public.reports FOR DELETE USING (auth.uid() = user_id);
