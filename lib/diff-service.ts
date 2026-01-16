import { createClient } from '@/lib/supabase/client';

export type DiffType = 'json' | 'text';

export interface DiffData {
  id?: string;
  diff_type: DiffType;
  // For JSON diffs
  original_json?: any;
  modified_json?: any;
  // For text diffs
  original_text?: string;
  modified_text?: string;
  // Metadata
  title?: string;
  description?: string;
  is_public: boolean;
  share_token?: string;
  tags?: string[];
}

export interface SavedDiff extends DiffData {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string | null;
  view_count: number;
}

/**
 * Save a diff to Supabase
 */
export async function saveDiff(data: DiffData): Promise<{ success: boolean; shareToken?: string; error?: string }> {
  try {
    const supabase = createClient();

    // Get current user (if authenticated)
    const { data: { user } } = await supabase.auth.getUser();

    const diffData: any = {
      diff_type: data.diff_type,
      title: data.title,
      description: data.description,
      is_public: data.is_public,
      tags: data.tags || [],
      user_id: user?.id || null,
    };

    // Set content based on diff type
    if (data.diff_type === 'json') {
      diffData.original_json = data.original_json;
      diffData.modified_json = data.modified_json;
    } else {
      diffData.original_text = data.original_text;
      diffData.modified_text = data.modified_text;
    }

    const { data: savedDiff, error } = await supabase
      .from('diffs')
      .insert(diffData)
      .select()
      .single();

    if (error) {
      console.error('Error saving diff:', error);
      return { success: false, error: error.message };
    }

    return {
      success: true,
      shareToken: savedDiff.share_token,
    };
  } catch (error) {
    console.error('Error saving diff:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Load a diff by share token
 */
export async function loadDiffByToken(shareToken: string): Promise<{ success: boolean; diff?: SavedDiff; error?: string }> {
  try {
    const supabase = createClient();

    console.log('Loading diff with token:', shareToken);

    const { data: diff, error } = await supabase
      .from('diffs')
      .select('*')
      .eq('share_token', shareToken)
      .single();

      console.log('Loaded diff:', diff);

    if (error) {
      console.error('Error loading diff:', error);
      return { success: false, error: error.message };
    }

    if (!diff) {
      return { success: false, error: 'Diff not found' };
    }

    // Increment view count using RPC function (bypasses RLS)
    await supabase.rpc('increment_diff_view_count', { diff_id: diff.id });

    return {
      success: true,
      diff: diff as SavedDiff,
    };
  } catch (error) {
    console.error('Error loading diff:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get user's saved diffs
 */
export async function getUserDiffs(limit: number = 50): Promise<{ success: boolean; diffs?: SavedDiff[]; error?: string }> {
  try {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    const { data: diffs, error } = await supabase
      .from('diffs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error loading user diffs:', error);
      return { success: false, error: error.message };
    }

    return {
      success: true,
      diffs: diffs as SavedDiff[],
    };
  } catch (error) {
    console.error('Error loading user diffs:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Delete a diff
 */
export async function deleteDiff(diffId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();

    const { error } = await supabase
      .from('diffs')
      .delete()
      .eq('id', diffId);

    if (error) {
      console.error('Error deleting diff:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting diff:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Update a diff
 */
export async function updateDiff(
  diffId: string,
  updates: Partial<DiffData>
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();

    const { error } = await supabase
      .from('diffs')
      .update(updates)
      .eq('id', diffId);

    if (error) {
      console.error('Error updating diff:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating diff:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Generate shareable URL for a diff
 */
export function getShareUrl(shareToken: string): string {
  const baseUrl = typeof window !== 'undefined'
    ? window.location.origin
    : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return `${baseUrl}/differ/${shareToken}`;
}

/**
 * Helper to get original content from a saved diff
 */
export function getOriginalContent(diff: SavedDiff): string {
  if (diff.diff_type === 'json') {
    return typeof diff.original_json === 'string'
      ? diff.original_json
      : JSON.stringify(diff.original_json, null, 2);
  }
  return diff.original_text || '';
}

/**
 * Helper to get modified content from a saved diff
 */
export function getModifiedContent(diff: SavedDiff): string {
  if (diff.diff_type === 'json') {
    return typeof diff.modified_json === 'string'
      ? diff.modified_json
      : JSON.stringify(diff.modified_json, null, 2);
  }
  return diff.modified_text || '';
}
