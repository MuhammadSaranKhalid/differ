'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { TooltipButton } from '@/components/tooltip-button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  getLocalHistory,
  saveToLocalHistory,
  deleteFromLocalHistory,
  updateLocalHistoryEntry,
  clearLocalHistory,
  getStorageInfo,
  searchLocalHistory,
  exportLocalHistory,
  importLocalHistory,
  type LocalHistoryEntry,
} from '@/lib/local-history-service';
import {
  Calendar,
  Trash2,
  FileJson,
  Search,
  Pin,
  PinOff,
  Edit3,
  MoreVertical,
  Download,
  Upload,
  HardDrive,
  Plus,
  Minus,
  RefreshCw,
  AlertTriangle,
  Check,
  X,
  Clock,
} from 'lucide-react';
import { toast } from 'sonner';

interface LocalHistoryProps {
  onLoadDiff: (original: string, modified: string) => void;
  currentOriginal?: string;
  currentModified?: string;
}

export function LocalHistory({ onLoadDiff, currentOriginal, currentModified }: LocalHistoryProps) {
  const [entries, setEntries] = useState<LocalHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [storageInfo, setStorageInfo] = useState({ usedMB: 0, maxMB: 5, percentage: 0, entryCount: 0 });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const loadHistory = useCallback(() => {
    setLoading(true);
    const history = searchQuery ? searchLocalHistory(searchQuery) : getLocalHistory();
    setEntries(history);
    setStorageInfo(getStorageInfo());
    setLoading(false);
  }, [searchQuery]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleSaveCurrent = () => {
    if (!currentOriginal?.trim() || !currentModified?.trim()) {
      toast.error('Both original and modified JSON are required');
      return;
    }

    const result = saveToLocalHistory(currentOriginal, currentModified);
    if (result.success) {
      toast.success('Saved to history');
      loadHistory();
    } else {
      toast.error(result.error || 'Failed to save');
    }
  };

  const handleDelete = (id: string) => {
    if (deleteFromLocalHistory(id)) {
      toast.success('Deleted from history');
      loadHistory();
    } else {
      toast.error('Failed to delete');
    }
  };

  const handleTogglePin = (id: string, currentlyPinned: boolean) => {
    if (updateLocalHistoryEntry(id, { isPinned: !currentlyPinned })) {
      toast.success(currentlyPinned ? 'Unpinned' : 'Pinned');
      loadHistory();
    }
  };

  const handleRename = (id: string) => {
    if (editName.trim()) {
      if (updateLocalHistoryEntry(id, { name: editName.trim() })) {
        toast.success('Renamed successfully');
        loadHistory();
      }
    }
    setEditingId(null);
    setEditName('');
  };

  const handleClearAll = () => {
    if (clearLocalHistory()) {
      toast.success('History cleared');
      loadHistory();
    }
    setShowClearConfirm(false);
  };

  const handleExport = () => {
    const data = exportLocalHistory();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `json-differ-history-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('History exported');
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const text = await file.text();
        const result = importLocalHistory(text);
        if (result.success) {
          toast.success(`Imported ${result.imported} entries`);
          loadHistory();
        } else {
          toast.error(result.error || 'Failed to import');
        }
      }
    };
    input.click();
  };

  const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  const formatDateTime = (dateString: string): string => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with actions */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Local History</h3>
          <Badge variant="secondary" className="font-normal">
            {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          {/* Save current button */}
          {currentOriginal && currentModified && (
            <TooltipButton
              variant="default"
              size="sm"
              onClick={handleSaveCurrent}
              tooltip="Save current comparison to history"
            >
              <Plus className="h-4 w-4 mr-1" />
              Save Current
            </TooltipButton>
          )}

          {/* Actions dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleExport} disabled={entries.length === 0}>
                <Download className="h-4 w-4 mr-2" />
                Export History
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleImport}>
                <Upload className="h-4 w-4 mr-2" />
                Import History
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setShowClearConfirm(true)}
                className="text-red-600"
                disabled={entries.length === 0}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Storage info bar */}
      <Card className="p-3 bg-muted/30">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <HardDrive className="h-4 w-4" />
            <span>
              {storageInfo.usedMB} MB / {storageInfo.maxMB} MB used
            </span>
          </div>
          <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${
                storageInfo.percentage > 80
                  ? 'bg-red-500'
                  : storageInfo.percentage > 50
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
              }`}
              style={{ width: `${storageInfo.percentage}%` }}
            />
          </div>
        </div>
      </Card>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or keys..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Empty state */}
      {entries.length === 0 && (
        <Card className="p-12 text-center">
          <FileJson className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">
            {searchQuery ? 'No matches found' : 'No saved comparisons'}
          </h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery
              ? 'Try a different search term'
              : 'Your comparisons will be saved here automatically when you click "Save Current"'}
          </p>
          {!searchQuery && currentOriginal && currentModified && (
            <Button onClick={handleSaveCurrent}>
              <Plus className="h-4 w-4 mr-2" />
              Save Current Comparison
            </Button>
          )}
        </Card>
      )}

      {/* History entries */}
      <div className="space-y-3">
        {entries.map((entry) => {
          const isExpanded = expandedId === entry.id;
          const isEditing = editingId === entry.id;
          const totalChanges = entry.stats.added + entry.stats.removed + entry.stats.modified;

          return (
            <Card
              key={entry.id}
              className={`overflow-hidden transition-all ${
                entry.isPinned ? 'border-primary/50 bg-primary/5' : ''
              }`}
            >
              <div className="p-4">
                <div className="flex items-start justify-between gap-4">
                  {/* Main content */}
                  <div className="flex-1 min-w-0">
                    {/* Name row */}
                    <div className="flex items-center gap-2 mb-2">
                      {entry.isPinned && (
                        <Pin className="h-3.5 w-3.5 text-primary shrink-0" />
                      )}

                      {isEditing ? (
                        <div className="flex items-center gap-2 flex-1">
                          <Input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="h-7 text-sm"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleRename(entry.id);
                              if (e.key === 'Escape') {
                                setEditingId(null);
                                setEditName('');
                              }
                            }}
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0"
                            onClick={() => handleRename(entry.id)}
                          >
                            <Check className="h-4 w-4 text-green-600" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0"
                            onClick={() => {
                              setEditingId(null);
                              setEditName('');
                            }}
                          >
                            <X className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      ) : (
                        <h4 className="font-medium truncate">{entry.name}</h4>
                      )}
                    </div>

                    {/* Stats badges */}
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      {entry.stats.added > 0 && (
                        <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
                          <Plus className="h-3 w-3 mr-1" />
                          {entry.stats.added}
                        </Badge>
                      )}
                      {entry.stats.removed > 0 && (
                        <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
                          <Minus className="h-3 w-3 mr-1" />
                          {entry.stats.removed}
                        </Badge>
                      )}
                      {entry.stats.modified > 0 && (
                        <Badge variant="outline" className="text-yellow-600 border-yellow-200 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800">
                          <RefreshCw className="h-3 w-3 mr-1" />
                          {entry.stats.modified}
                        </Badge>
                      )}
                      {totalChanges === 0 && (
                        <Badge variant="outline" className="text-muted-foreground">
                          No changes
                        </Badge>
                      )}
                    </div>

                    {/* Meta info */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                      <div className="flex items-center gap-1" title={formatDateTime(entry.createdAt)}>
                        <Clock className="h-3 w-3" />
                        {formatRelativeTime(entry.createdAt)}
                      </div>
                      <span>{entry.originalSize} KB vs {entry.modifiedSize} KB</span>
                    </div>

                    {/* Preview keys */}
                    {!isExpanded && entry.preview.originalKeys.length > 0 && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        <span className="font-medium">Keys:</span>{' '}
                        {entry.preview.originalKeys.join(', ')}
                      </div>
                    )}

                    {/* Expanded preview */}
                    {isExpanded && (
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <div className="p-2 bg-muted/30 rounded text-xs font-mono overflow-hidden">
                          <div className="font-medium text-muted-foreground mb-1">Original</div>
                          <pre className="whitespace-pre-wrap wrap-break-word max-h-32 overflow-y-auto">
                            {entry.original.substring(0, 500)}
                            {entry.original.length > 500 && '...'}
                          </pre>
                        </div>
                        <div className="p-2 bg-muted/30 rounded text-xs font-mono overflow-hidden">
                          <div className="font-medium text-muted-foreground mb-1">Modified</div>
                          <pre className="whitespace-pre-wrap wrap-break-word max-h-32 overflow-y-auto">
                            {entry.modified.substring(0, 500)}
                            {entry.modified.length > 500 && '...'}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => onLoadDiff(entry.original, entry.modified)}
                    >
                      Load
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                      className="px-2"
                    >
                      {isExpanded ? 'Less' : 'More'}
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setEditingId(entry.id);
                            setEditName(entry.name);
                          }}
                        >
                          <Edit3 className="h-4 w-4 mr-2" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleTogglePin(entry.id, entry.isPinned)}>
                          {entry.isPinned ? (
                            <>
                              <PinOff className="h-4 w-4 mr-2" />
                              Unpin
                            </>
                          ) : (
                            <>
                              <Pin className="h-4 w-4 mr-2" />
                              Pin
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(entry.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Clear confirmation dialog */}
      <Dialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Clear All History?
            </DialogTitle>
            <DialogDescription>
              This will permanently delete all {entries.length} saved comparisons. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowClearConfirm(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleClearAll}>
              Clear All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
