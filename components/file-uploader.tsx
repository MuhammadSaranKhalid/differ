'use client';

import { useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileJson } from 'lucide-react';
import { toast } from 'sonner';

interface FileUploaderProps {
  onLoad: (content: string, fileName?: string) => void;
  accept?: string;
  maxSizeMB?: number;
  label?: string;
}

export function FileUploader({
  onLoad,
  accept = '.json,.yaml,.yml,.xml',
  maxSizeMB = 10,
  label = 'JSON, YAML, or XML file',
}: FileUploaderProps) {
  const handleFile = useCallback(
    async (file: File) => {
      const maxSize = maxSizeMB * 1024 * 1024;

      if (file.size > maxSize) {
        toast.error(`File too large. Maximum size: ${maxSizeMB}MB`);
        return;
      }

      try {
        const content = await file.text();
        onLoad(content, file.name);
        toast.success(`Loaded ${file.name}`);
      } catch (error) {
        toast.error('Failed to read file');
      }
    },
    [onLoad, maxSizeMB]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleClick = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept;
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleFile(file);
      }
    };
    input.click();
  }, [accept, handleFile]);

  return (
    <Card
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={handleClick}
      className="border-2 border-dashed cursor-pointer hover:border-primary transition-colors"
    >
      <div className="p-8 text-center">
        <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-sm font-medium mb-1">
          Drag & drop {label} or click to browse
        </p>
        <p className="text-xs text-muted-foreground">
          Maximum file size: {maxSizeMB}MB
        </p>
        <Button variant="outline" size="sm" className="mt-4" onClick={(e) => e.stopPropagation()}>
          <FileJson className="h-4 w-4 mr-2" />
          Choose File
        </Button>
      </div>
    </Card>
  );
}

export function CompactFileUploader({ onLoad, accept = '.json,.yaml,.yml,.xml' }: FileUploaderProps) {
  const handleFile = useCallback(
    async (file: File) => {
      try {
        const content = await file.text();
        onLoad(content, file.name);
        toast.success(`Loaded ${file.name}`);
      } catch (error) {
        toast.error('Failed to read file');
      }
    },
    [onLoad]
  );

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = accept;
        input.onchange = (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (file) handleFile(file);
        };
        input.click();
      }}
      title="Upload a JSON file from your computer"
    >
      <Upload className="h-4 w-4 mr-2" />
      Upload File
    </Button>
  );
}
