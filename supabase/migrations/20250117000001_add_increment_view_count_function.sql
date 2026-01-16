-- Create a function to increment view count that bypasses RLS
-- This allows anonymous users to increment view count on public diffs

CREATE OR REPLACE FUNCTION public.increment_diff_view_count(diff_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER -- This runs with the privileges of the function owner (bypasses RLS)
SET search_path = public
AS $$
BEGIN
  UPDATE public.diffs
  SET view_count = view_count + 1
  WHERE id = diff_id;
END;
$$;

-- Grant execute permission to anonymous and authenticated users
GRANT EXECUTE ON FUNCTION public.increment_diff_view_count(UUID) TO anon;
GRANT EXECUTE ON FUNCTION public.increment_diff_view_count(UUID) TO authenticated;

COMMENT ON FUNCTION public.increment_diff_view_count IS 'Increments the view count for a diff. Uses SECURITY DEFINER to bypass RLS.';
