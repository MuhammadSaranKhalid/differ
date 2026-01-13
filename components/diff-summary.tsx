import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, Edit, Equal } from 'lucide-react';

interface DiffStats {
  added: number;
  removed: number;
  modified: number;
  unchanged: number;
  total: number;
}

interface DiffSummaryProps {
  stats: DiffStats;
  className?: string;
}

export function DiffSummary({ stats, className = '' }: DiffSummaryProps) {
  const hasChanges = stats.added > 0 || stats.removed > 0 || stats.modified > 0;

  if (!hasChanges && stats.total === 0) {
    return null;
  }

  return (
    <Card className={`p-4 bg-muted/30 ${className}`}>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Diff Summary:</span>
          {!hasChanges && stats.total > 0 ? (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <Equal className="h-3 w-3 mr-1" />
              No differences found
            </Badge>
          ) : null}
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {stats.added > 0 && (
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-green-50 border border-green-200">
                <Plus className="h-3.5 w-3.5 text-green-600" />
                <span className="text-sm font-medium text-green-700">{stats.added}</span>
                <span className="text-xs text-green-600">added</span>
              </div>
            </div>
          )}

          {stats.removed > 0 && (
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-red-50 border border-red-200">
                <Minus className="h-3.5 w-3.5 text-red-600" />
                <span className="text-sm font-medium text-red-700">{stats.removed}</span>
                <span className="text-xs text-red-600">removed</span>
              </div>
            </div>
          )}

          {stats.modified > 0 && (
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-yellow-50 border border-yellow-200">
                <Edit className="h-3.5 w-3.5 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-700">{stats.modified}</span>
                <span className="text-xs text-yellow-600">modified</span>
              </div>
            </div>
          )}

          {stats.unchanged > 0 && (
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-50 border border-gray-200">
                <Equal className="h-3.5 w-3.5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">{stats.unchanged}</span>
                <span className="text-xs text-gray-600">unchanged</span>
              </div>
            </div>
          )}
        </div>

        {stats.total > 0 && (
          <div className="text-sm text-muted-foreground">
            Total: <span className="font-medium">{stats.total}</span> {stats.total === 1 ? 'field' : 'fields'}
          </div>
        )}
      </div>
    </Card>
  );
}
