-- Enable Row Level Security on accounts table
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;

-- Enable Row Level Security on amazon table  
ALTER TABLE public.amazon ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies for accounts table
CREATE POLICY "Anyone can view accounts" ON public.accounts FOR SELECT USING (true);
CREATE POLICY "Anyone can insert accounts" ON public.accounts FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update accounts" ON public.accounts FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete accounts" ON public.accounts FOR DELETE USING (true);

-- Create basic RLS policies for amazon table
CREATE POLICY "Anyone can view amazon" ON public.amazon FOR SELECT USING (true);
CREATE POLICY "Anyone can insert amazon" ON public.amazon FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update amazon" ON public.amazon FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete amazon" ON public.amazon FOR DELETE USING (true);