-- Enable RLS on auth_users table
ALTER TABLE public.auth_users ENABLE ROW LEVEL SECURITY;

-- Enable RLS on users table  
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for auth_users table
CREATE POLICY "Allow public signup" ON public.auth_users
FOR INSERT TO public
WITH CHECK (true);

CREATE POLICY "Users can view their own profile" ON public.auth_users
FOR SELECT TO public
USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own profile" ON public.auth_users
FOR UPDATE TO public
USING (auth.uid()::text = id::text);

-- Create RLS policies for users table
CREATE POLICY "Users can view all user records" ON public.users
FOR SELECT TO public
USING (true);

CREATE POLICY "Users can create user records" ON public.users
FOR INSERT TO public
WITH CHECK (true);

CREATE POLICY "Users can update user records" ON public.users
FOR UPDATE TO public
USING (true);

CREATE POLICY "Users can delete user records" ON public.users
FOR DELETE TO public
USING (true);