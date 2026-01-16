'use client';

import { JsonDiffEditor } from '@/components/json-diff-editor';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SavedDiff, getOriginalContent, getModifiedContent } from '@/lib/diff-service';
import { getJsonSizeKB, countDifferences } from '@/lib/json-utils';
import { FileJson, FileText, Eye, Calendar, Copy } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function SharedDiffView({ diff }: { diff: SavedDiff }) {
  const [copied, setCopied] = useState(false);

  const original = getOriginalContent(diff);
  const modified = getModifiedContent(diff);
  const isTextDiff = diff.diff_type === 'text';

  // Only count differences for JSON diffs
  const diffCount = isTextDiff ? 0 : countDifferences(original, modified);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success('URL copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy URL');
    }
  };

  const formattedDate = new Date(diff.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const DiffIcon = isTextDiff ? FileText : FileJson;
  const diffTypeLabel = isTextDiff ? 'Text' : 'JSON';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DiffIcon className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">
                  {diff.title || `Shared ${diffTypeLabel} Diff`}
                </h1>
                {diff.description && (
                  <p className="text-sm text-muted-foreground">{diff.description}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button onClick={handleCopyUrl} variant="outline" size="sm">
                <Copy className="h-4 w-4 mr-2" />
                {copied ? 'Copied!' : 'Copy Link'}
              </Button>
              <a href="/differ">
                <Button variant="default" size="sm">
                  Create Your Own
                </Button>
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Info Card */}
        <Card className="mb-4 p-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-6 flex-wrap">
              <Badge variant="outline">
                {diffTypeLabel} Diff
              </Badge>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Created {formattedDate}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {diff.view_count} views
                </span>
              </div>

              {!isTextDiff && (
                <Badge variant="secondary">
                  {diffCount} difference{diffCount !== 1 ? 's' : ''}
                </Badge>
              )}

              {diff.tags && diff.tags.length > 0 && (
                <div className="flex gap-1">
                  {diff.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Original: {getJsonSizeKB(original)} KB</span>
              <span>Modified: {getJsonSizeKB(modified)} KB</span>
            </div>
          </div>
        </Card>

        {/* Diff Editor */}
        <JsonDiffEditor
          original={original}
          modified={modified}
          readOnly={true}
          showDiff={true}
          height="calc(100vh - 300px)"
          compareMode={isTextDiff ? 'text' : 'json'}
        />
      </div>
    </div>
  );
}
