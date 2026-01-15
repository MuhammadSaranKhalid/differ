'use client';

import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { TooltipButton } from '@/components/tooltip-button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  getLocalHistory,
  saveToLocalHistory,
  deleteFromLocalHistory,
  updateLocalHistoryEntry,
  clearLocalHistory,
  getStorageInfo,
  searchLocalHistory,
  type LocalHistoryEntry,
} from '@/lib/local-history-service';
import {
  Trash2,
  Search,
  Pin,
  PinOff,
  Edit3,
  Plus,
  Check,
  ChevronLeft,
  ChevronRight,
  History,
  Settings,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface HistorySidebarProps {
  onLoadDiff: (original: string, modified: string) => void;
  currentOriginal?: string;
  currentModified?: string;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function HistorySidebar({
  onLoadDiff,
  currentOriginal,
  currentModified,
  isCollapsed,
  onToggleCollapse,
}: HistorySidebarProps) {
  const [entries, setEntries] = useState<LocalHistoryEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [storageInfo, setStorageInfo] = useState({ usedMB: 0, maxMB: 5, percentage: 0, entryCount: 0 });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const loadHistory = useCallback(() => {
    const history = searchQuery ? searchLocalHistory(searchQuery) : getLocalHistory();
    setEntries(history);
    setStorageInfo(getStorageInfo());
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

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (deleteFromLocalHistory(id)) {
      toast.success('Deleted');
      loadHistory();
    }
  };

  const handleTogglePin = (id: string, currentlyPinned: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    if (updateLocalHistoryEntry(id, { isPinned: !currentlyPinned })) {
      loadHistory();
    }
  };

  const handleRename = (id: string) => {
    if (editName.trim()) {
      if (updateLocalHistoryEntry(id, { name: editName.trim() })) {
        toast.success('Renamed');
        loadHistory();
      }
    }
    setEditingId(null);
    setEditName('');
  };

  const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Collapsed state - just show toggle button
  if (isCollapsed) {
    return (
      <div className="w-12 border-r bg-muted/30 flex flex-col items-center py-4 gap-2 shrink-0">
        <TooltipButton
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          tooltip="Expand history sidebar"
          className="h-10 w-10 p-0"
        >
          <ChevronRight className="h-5 w-5" />
        </TooltipButton>
        <div className="w-8 h-px bg-border" />
        <TooltipButton
          variant="ghost"
          size="sm"
          tooltip="History"
          className="h-10 w-10 p-0"
          onClick={onToggleCollapse}
        >
          <History className="h-5 w-5" />
        </TooltipButton>
        {entries.length > 0 && (
          <Badge variant="secondary" className="text-xs px-1.5">
            {entries.length}
          </Badge>
        )}
      </div>
    );
  }

  return (
    <div className="w-72 border-r bg-muted/20 flex flex-col min-h-0">
      {/* Header */}
      <div className="p-3 border-b flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium text-sm">History</span>
          <Badge variant="secondary" className="text-xs">
            {entries.length}
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => clearLocalHistory() && loadHistory()}
                className="text-red-600"
                disabled={entries.length === 0}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="h-7 w-7 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Save button */}
      {currentOriginal && currentModified && (
        <div className="p-2 border-b">
          <Button
            variant="default"
            size="sm"
            onClick={handleSaveCurrent}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-1" />
            Save Current
          </Button>
        </div>
      )}

      {/* Search */}
      <div className="p-2 border-b">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 pl-8 text-sm"
          />
        </div>
      </div>

      {/* Storage indicator */}
      <div className="px-3 py-2 border-b text-xs text-muted-foreground flex items-center justify-between">
        <span>{storageInfo.usedMB}MB / {storageInfo.maxMB}MB</span>
        <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full transition-all",
              storageInfo.percentage > 80 ? 'bg-red-500' :
              storageInfo.percentage > 50 ? 'bg-yellow-500' : 'bg-green-500'
            )}
            style={{ width: `${storageInfo.percentage}%` }}
          />
        </div>
      </div>

      {/* History list */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {entries.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground px-4">
              <History className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-medium mb-1">
                {searchQuery ? 'No matches' : 'No history yet'}
              </p>
              <p className="text-xs opacity-70">
                {searchQuery
                  ? 'Try a different search'
                  : 'Click "Save Current" after comparing to save'}
              </p>
            </div>
          ) : (
            entries.map((entry) => {
              const isEditing = editingId === entry.id;
              const totalChanges = entry.stats.added + entry.stats.removed + entry.stats.modified;

              return (
                <div
                  key={entry.id}
                  className={cn(
                    "group p-2 rounded-lg cursor-pointer transition-colors hover:bg-accent",
                    entry.isPinned && "bg-primary/5 border border-primary/20"
                  )}
                  onClick={() => onLoadDiff(entry.original, entry.modified)}
                >
                  {/* Name row */}
                  <div className="flex items-center gap-1.5 mb-1">
                    {entry.isPinned && (
                      <Pin className="h-3 w-3 text-primary shrink-0" />
                    )}
                    {isEditing ? (
                      <div className="flex items-center gap-1 flex-1" onClick={(e) => e.stopPropagation()}>
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="h-6 text-xs"
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
                          className="h-6 w-6 p-0"
                          onClick={() => handleRename(entry.id)}
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <span className="text-sm font-medium truncate flex-1">
                        {entry.name}
                      </span>
                    )}

                    {/* Actions (visible on hover) */}
                    {!isEditing && (
                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                          onClick={(e) => handleTogglePin(entry.id, entry.isPinned, e)}
                        >
                          {entry.isPinned ? (
                            <PinOff className="h-3 w-3" />
                          ) : (
                            <Pin className="h-3 w-3" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingId(entry.id);
                            setEditName(entry.name);
                          }}
                        >
                          <Edit3 className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-600"
                          onClick={(e) => handleDelete(entry.id, e)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Stats and time row */}
                  <div className="flex items-center gap-1.5 text-xs mt-1">
                    {entry.stats.added > 0 && (
                      <span className="text-green-600 font-medium">+{entry.stats.added}</span>
                    )}
                    {entry.stats.removed > 0 && (
                      <span className="text-red-600 font-medium">-{entry.stats.removed}</span>
                    )}
                    {entry.stats.modified > 0 && (
                      <span className="text-yellow-600 font-medium">~{entry.stats.modified}</span>
                    )}
                    {totalChanges === 0 && (
                      <span className="text-muted-foreground">No changes</span>
                    )}
                    <span className="text-muted-foreground ml-auto">
                      {formatRelativeTime(entry.createdAt)}
                    </span>
                  </div>

                  {/* Size info */}
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {entry.originalSize}KB vs {entry.modifiedSize}KB
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
