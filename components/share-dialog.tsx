'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { saveDiff, getShareUrl } from '@/lib/diff-service';
import { Copy, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  originalJson: string;
  modifiedJson: string;
}

export function ShareDialog({
  open,
  onOpenChange,
  originalJson,
  modifiedJson,
}: ShareDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    setLoading(true);

    try {
      const original = JSON.parse(originalJson);
      const modified = JSON.parse(modifiedJson);

      const result = await saveDiff({
        original_json: original,
        modified_json: modified,
        title: title || 'Untitled Diff',
        description,
        is_public: isPublic,
        tags: tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      });

      if (result.success && result.shareToken) {
        const url = getShareUrl(result.shareToken);
        setShareUrl(url);
        toast.success('Diff saved successfully! Share link is ready.');
      } else {
        toast.error(`Failed to save diff: ${result.error}`);
      }
    } catch (error) {
      toast.error('Invalid JSON. Please fix errors before sharing.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleClose = () => {
    setShareUrl('');
    setTitle('');
    setDescription('');
    setTags('');
    setCopied(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Share JSON Diff</DialogTitle>
          <DialogDescription>
            {shareUrl
              ? 'Your diff has been saved! Share the link below.'
              : 'Configure sharing options for your JSON diff.'}
          </DialogDescription>
        </DialogHeader>

        {!shareUrl ? (
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title (optional)</Label>
              <Input
                id="title"
                placeholder="My API Response Comparison"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Input
                id="description"
                placeholder="Comparing production vs staging responses"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tags">Tags (optional, comma-separated)</Label>
              <Input
                id="tags"
                placeholder="api, production, bug-fix"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="public"
                checked={isPublic}
                onCheckedChange={(checked) => setIsPublic(!!checked)}
              />
              <Label htmlFor="public" className="text-sm cursor-pointer">
                Make this diff public (anyone with the link can view it)
              </Label>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Share URL</Label>
              <div className="flex gap-2">
                <Input value={shareUrl} readOnly className="flex-1" />
                <Button onClick={handleCopy} size="icon" variant="outline">
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              {isPublic
                ? 'This diff is public. Anyone with the link can view it.'
                : 'This diff is private. Only you can view it (when logged in).'}
            </p>
          </div>
        )}

        <DialogFooter>
          {!shareUrl ? (
            <>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleShare} disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Share
              </Button>
            </>
          ) : (
            <Button onClick={handleClose}>Done</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
