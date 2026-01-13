import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface EditorLoadingProps {
  height?: string;
  showDualEditor?: boolean;
}

export function EditorLoading({ height = '600px', showDualEditor = true }: EditorLoadingProps) {
  return (
    <div className="space-y-4">
      {/* Action Buttons Skeleton */}
      <div className="flex items-center gap-2 flex-wrap">
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-28" />
        <div className="flex-1" />
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-24" />
      </div>

      {/* Editor Skeleton */}
      <Card className="relative overflow-hidden" style={{ height }}>
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Loading editor...</p>
          </div>
        </div>

        {showDualEditor ? (
          <div className="grid grid-cols-2 gap-4 p-4 h-full">
            <Skeleton className="h-full w-full" />
            <Skeleton className="h-full w-full" />
          </div>
        ) : (
          <div className="p-4 h-full">
            <Skeleton className="h-full w-full" />
          </div>
        )}
      </Card>
    </div>
  );
}

export function PanelLoading() {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-9 w-32" />
        </div>
        <Skeleton className="h-[400px] w-full" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
    </Card>
  );
}
