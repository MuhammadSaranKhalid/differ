'use client';

import { useState, useEffect } from 'react';
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
import { Copy, Check, Link2, Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import LZString from 'lz-string';

interface ShareLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  originalJson: string;
  modifiedJson: string;
}

export function ShareLinkDialog({
  open,
  onOpenChange,
  originalJson,
  modifiedJson,
}: ShareLinkDialogProps) {
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open && originalJson && modifiedJson) {
      generateShareUrl();
    }
  }, [open, originalJson, modifiedJson]);

  const generateShareUrl = async () => {
    setGenerating(true);
    setError('');

    try {
      // Validate JSON first
      JSON.parse(originalJson);
      JSON.parse(modifiedJson);

      // Compress the data
      const data = JSON.stringify({
        o: originalJson,
        m: modifiedJson,
      });

      const compressed = LZString.compressToEncodedURIComponent(data);

      // Check if URL would be too long (browsers typically support ~2000 chars)
      const baseUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/differ`
        : '/differ';

      const url = `${baseUrl}?d=${compressed}`;

      if (url.length > 8000) {
        setError('JSON data is too large to share via URL. Try exporting as a file instead.');
        setShareUrl('');
      } else {
        setShareUrl(url);
      }
    } catch (err) {
      setError('Invalid JSON. Please fix errors before sharing.');
      setShareUrl('');
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleDownloadAsFile = () => {
    const data = JSON.stringify({
      original: JSON.parse(originalJson),
      modified: JSON.parse(modifiedJson),
      exportedAt: new Date().toISOString(),
    }, null, 2);

    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `json-diff-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Downloaded diff file');
  };

  const handleClose = () => {
    setShareUrl('');
    setCopied(false);
    setError('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            Share JSON Diff
          </DialogTitle>
          <DialogDescription>
            Generate a shareable link that contains your JSON data. No server required - data is encoded in the URL.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {generating ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Generating link...</span>
            </div>
          ) : error ? (
            <div className="text-center py-4">
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={handleDownloadAsFile} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download as File Instead
              </Button>
            </div>
          ) : shareUrl ? (
            <>
              <div className="grid gap-2">
                <Label>Share URL</Label>
                <div className="flex gap-2">
                  <Input
                    value={shareUrl}
                    readOnly
                    className="flex-1 text-xs font-mono"
                  />
                  <Button onClick={handleCopy} size="icon" variant="outline">
                    {copied ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  URL length: {shareUrl.length.toLocaleString()} characters
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg p-3 text-sm">
                <p className="font-medium mb-1">Privacy Notice</p>
                <p className="text-muted-foreground text-xs">
                  Your JSON data is compressed and encoded directly in the URL.
                  No data is sent to any server. Anyone with this link can view the diff.
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Button onClick={handleDownloadAsFile} variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download as File
                </Button>
              </div>
            </>
          ) : null}
        </div>

        <DialogFooter>
          <Button onClick={handleClose} variant={shareUrl ? 'default' : 'outline'}>
            {shareUrl ? 'Done' : 'Cancel'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
