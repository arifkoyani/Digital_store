-- Remove unique constraint on email column from users table
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_email_key;