'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getUserDiffs, deleteDiff, type SavedDiff } from '@/lib/diff-service';
import { getJsonSizeKB } from '@/lib/json-utils';
import { Calendar, Eye, Trash2, FileJson, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

interface UserHistoryProps {
  onLoadDiff: (original: string, modified: string) => void;
}

export function UserHistory({ onLoadDiff }: UserHistoryProps) {
  const [diffs, setDiffs] = useState<SavedDiff[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    loadHistory();
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    setIsAuthenticated(!!user);
  };

  const loadHistory = async () => {
    setLoading(true);
    const result = await getUserDiffs(50);
    if (result.success && result.diffs) {
      setDiffs(result.diffs);
    }
    setLoading(false);
  };

  const handleDelete = async (diffId: string) => {
    if (!confirm('Are you sure you want to delete this diff?')) {
      return;
    }

    const result = await deleteDiff(diffId);
    if (result.success) {
      setDiffs(diffs.filter((d) => d.id !== diffId));
      toast.success('Diff deleted successfully');
    } else {
      toast.error(`Failed to delete: ${result.error}`);
    }
  };

  const handleLoad = (diff: SavedDiff) => {
    const original = JSON.stringify(diff.original_json, null, 2);
    const modified = JSON.stringify(diff.modified_json, null, 2);
    onLoadDiff(original, modified);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Card className="p-12 text-center">
        <FileJson className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">Sign in to view history</h3>
        <p className="text-muted-foreground mb-4">
          Create an account to save and access your diff history
        </p>
        <a href="/auth/login">
          <Button>Sign In</Button>
        </a>
      </Card>
    );
  }

  if (diffs.length === 0) {
    return (
      <Card className="p-12 text-center">
        <FileJson className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">No saved diffs yet</h3>
        <p className="text-muted-foreground">
          Your saved comparisons will appear here. Share a diff to save it to your history.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">
          Your Saved Diffs ({diffs.length})
        </h3>
        <Button variant="outline" size="sm" onClick={loadHistory}>
          Refresh
        </Button>
      </div>

      <div className="grid gap-4">
        {diffs.map((diff) => {
          const originalSize = getJsonSizeKB(JSON.stringify(diff.original_json));
          const modifiedSize = getJsonSizeKB(JSON.stringify(diff.modified_json));
          const formattedDate = new Date(diff.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          });

          return (
            <Card key={diff.id} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium truncate">
                      {diff.title || 'Untitled Diff'}
                    </h4>
                    {diff.is_public && (
                      <Badge variant="secondary" className="shrink-0">
                        Public
                      </Badge>
                    )}
                  </div>

                  {diff.description && (
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {diff.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formattedDate}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {diff.view_count} views
                    </div>
                    <span>Original: {originalSize} KB</span>
                    <span>Modified: {modifiedSize} KB</span>
                  </div>

                  {diff.tags && diff.tags.length > 0 && (
                    <div className="flex gap-1 mt-2">
                      {diff.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleLoad(diff)}
                  >
                    Load
                  </Button>
                  {diff.is_public && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        const url = `${window.location.origin}/differ/${diff.share_token}`;
                        try {
                          await navigator.clipboard.writeText(url);
                          toast.success('Link copied to clipboard!');
                        } catch (error) {
                          toast.error('Failed to copy link');
                        }
                      }}
                    >
                      Copy Link
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(diff.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
