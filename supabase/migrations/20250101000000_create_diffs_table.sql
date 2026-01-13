-- Create the diffs table for storing JSON comparisons
CREATE TABLE IF NOT EXISTS public.diffs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

  -- JSON data
  original_json JSONB NOT NULL,
  modified_json JSONB NOT NULL,

  -- Metadata
  title TEXT,
  description TEXT,

  -- Sharing & Privacy
  is_public BOOLEAN DEFAULT false NOT NULL,
  share_token VARCHAR(255) UNIQUE,

  -- User association (nullable for anonymous shares)
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Tags for organization
  tags TEXT[] DEFAULT '{}',

  -- View counter
  view_count INTEGER DEFAULT 0
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_diffs_user_id ON public.diffs(user_id);
CREATE INDEX IF NOT EXISTS idx_diffs_share_token ON public.diffs(share_token);
CREATE INDEX IF NOT EXISTS idx_diffs_created_at ON public.diffs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_diffs_is_public ON public.diffs(is_public);

-- Enable Row Level Security
ALTER TABLE public.diffs ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Public diffs can be read by anyone
CREATE POLICY "Public diffs are viewable by everyone"
  ON public.diffs FOR SELECT
  USING (is_public = true);

-- Users can view their own diffs
CREATE POLICY "Users can view their own diffs"
  ON public.diffs FOR SELECT
  USING (auth.uid() = user_id);

-- Authenticated users can insert diffs
CREATE POLICY "Authenticated users can create diffs"
  ON public.diffs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Anonymous users can insert public diffs
CREATE POLICY "Anonymous users can create public diffs"
  ON public.diffs FOR INSERT
  WITH CHECK (user_id IS NULL AND is_public = true);

-- Users can update their own diffs
CREATE POLICY "Users can update their own diffs"
  ON public.diffs FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own diffs
CREATE POLICY "Users can delete their own diffs"
  ON public.diffs FOR DELETE
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.diffs
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Function to generate unique share tokens
CREATE OR REPLACE FUNCTION public.generate_share_token()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..12 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Trigger to generate share_token on insert if not provided
CREATE OR REPLACE FUNCTION public.set_share_token()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.share_token IS NULL THEN
    NEW.share_token := public.generate_share_token();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_share_token_trigger
  BEFORE INSERT ON public.diffs
  FOR EACH ROW
  EXECUTE FUNCTION public.set_share_token();

COMMENT ON TABLE public.diffs IS 'Stores JSON diff comparisons with sharing capabilities';
COMMENT ON COLUMN public.diffs.share_token IS 'Unique token for sharing diffs via URL';
COMMENT ON COLUMN public.diffs.is_public IS 'If true, anyone with the link can view this diff';
COMMENT ON COLUMN public.diffs.user_id IS 'Owner of the diff. NULL for anonymous diffs';
