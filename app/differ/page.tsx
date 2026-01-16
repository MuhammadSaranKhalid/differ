'use client';

import { useState, useCallback, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import LZString from 'lz-string';
import dynamic from 'next/dynamic';
import { ErrorBoundary } from '@/components/error-boundary';
import { EditorLoading } from '@/components/editor-loading';
// import { OnboardingTour } from '@/components/onboarding-tour';
import type { editor } from 'monaco-editor';

// Lazy load heavy components
const JsonDiffEditor = dynamic(
  () => import('@/components/json-diff-editor').then((mod) => ({ default: mod.JsonDiffEditor })),
  {
    ssr: false,
    loading: () => <EditorLoading height="600px" showDualEditor={true} />
  }
);

// Commented out - only Compare tab for now
// const FormatConverterPanel = dynamic(
//   () => import('@/components/format-converter-panel').then((mod) => ({ default: mod.FormatConverterPanel })),
//   {
//     ssr: false,
//     loading: () => <PanelLoading />
//   }
// );

// const SchemaValidatorPanel = dynamic(
//   () => import('@/components/schema-validator-panel').then((mod) => ({ default: mod.SchemaValidatorPanel })),
//   {
//     ssr: false,
//     loading: () => <PanelLoading />
//   }
// );

// const LocalHistory = dynamic(
//   () => import('@/components/local-history').then((mod) => ({ default: mod.LocalHistory })),
//   {
//     ssr: false,
//     loading: () => <PanelLoading />
//   }
// );

const HistorySidebar = dynamic(
  () => import('@/components/history-sidebar').then((mod) => ({ default: mod.HistorySidebar })),
  { ssr: false }
);

const ShareLinkDialog = dynamic(
  () => import('@/components/share-link-dialog').then((mod) => ({ default: mod.ShareLinkDialog })),
  { ssr: false }
);

const ShareDialog = dynamic(
  () => import('@/components/share-dialog').then((mod) => ({ default: mod.ShareDialog })),
  { ssr: false }
);

const KeyboardShortcutsDialog = dynamic(
  () => import('@/components/keyboard-shortcuts-dialog').then((mod) => ({ default: mod.KeyboardShortcutsDialog })),
  { ssr: false }
);

const ConfirmDialog = dynamic(
  () => import('@/components/confirm-dialog').then((mod) => ({ default: mod.ConfirmDialog })),
  { ssr: false }
);

const DiffSummary = dynamic(
  () => import('@/components/diff-summary').then((mod) => ({ default: mod.DiffSummary })),
  { ssr: false }
);

const CompactFileUploader = dynamic(
  () => import('@/components/file-uploader').then((mod) => ({ default: mod.CompactFileUploader })),
  { ssr: false }
);

const DiffNavigation = dynamic(
  () => import('@/components/diff-navigation').then((mod) => ({ default: mod.DiffNavigation })),
  { ssr: false }
);

import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts';
import { useDebounce } from 'use-debounce';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { HelpIcon } from '@/components/help-icon';
import { Button } from '@/components/ui/button';
import { TooltipButton } from '@/components/tooltip-button';
// import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  validateJson,
  formatJson,
  processJsonForDiff,
  getJsonSizeKB,
  calculateDetailedDiffStats,
  type DiffOptions,
  type DetailedDiffStats,
} from '@/lib/json-utils';
import { exportAsHtml, exportAsMarkdown, exportAsText } from '@/lib/export-utils';
import {
  FileJson,
  ArrowLeftRight,
  Copy,
  Check,
  Download,
  Share2,
  Wand2,
  // AlertCircle,
  Shield,
  Settings,
  Trash2,
  History,
  FileText,
  Code,
  CheckCircle2,
  Keyboard,
  Sparkles,
  Undo2,
  GitCompareArrows,
} from 'lucide-react';
import { toast } from 'sonner';

function DifferPageContent() {
  const [original, setOriginal] = useState('');
  const [modified, setModified] = useState('');
  const [originalFileName, setOriginalFileName] = useState<string>();
  const [modifiedFileName, setModifiedFileName] = useState<string>();
  const [showDiff, setShowDiff] = useState(false);
  const [currentDiffIndex, setCurrentDiffIndex] = useState(0);
  const [privacyMode, setPrivacyMode] = useState(true);
  const [showPrivacyDialog, setShowPrivacyDialog] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState('compare');
  const [compareMode, setCompareMode] = useState<'json' | 'text'>('json');
  const [historySidebarCollapsed, setHistorySidebarCollapsed] = useState(false);

  // Ref to store the diff editor instance
  const diffEditorRef = useRef<editor.IStandaloneDiffEditor | null>(null);

  // Undo state
  const [undoState, setUndoState] = useState<{
    original: string;
    modified: string;
    originalFileName?: string;
    modifiedFileName?: string;
  } | null>(null);

  // Diff options
  const [diffOptions, setDiffOptions] = useState<DiffOptions>({
    ignoreKeyOrder: false,
    ignoreArrayOrder: false,
    sortKeys: false,
    ignoreKeys: [],
  });
  const [ignoreKeysInput, setIgnoreKeysInput] = useState('');

  // Validation states
  const [originalValidation, setOriginalValidation] = useState(validateJson(''));
  const [modifiedValidation, setModifiedValidation] = useState(validateJson(''));

  // Stats
  const [originalSize, setOriginalSize] = useState(0);
  const [modifiedSize, setModifiedSize] = useState(0);
  const [detailedStats, setDetailedStats] = useState<DetailedDiffStats>({
    added: 0,
    removed: 0,
    modified: 0,
    unchanged: 0,
    total: 0,
  });

  // Debounced values for validation (prevents lag during typing)
  const [debouncedOriginal] = useDebounce(original, 300);
  const [debouncedModified] = useDebounce(modified, 300);

  // URL search params for loading shared diffs
  const searchParams = useSearchParams();

  // Load shared diff from URL on mount
  useEffect(() => {
    const sharedData = searchParams.get('d');
    if (sharedData) {
      try {
        const decompressed = LZString.decompressFromEncodedURIComponent(sharedData);
        if (decompressed) {
          const parsed = JSON.parse(decompressed);
          if (parsed.o && parsed.m) {
            setOriginal(parsed.o);
            setModified(parsed.m);
            toast.success('Loaded shared diff');
            // Clear the URL parameter without reloading
            window.history.replaceState({}, '', '/differ');
          }
        }
      } catch (error) {
        toast.error('Failed to load shared diff');
        console.error('Failed to parse shared data:', error);
      }
    }
  }, [searchParams]);

  // Update validation when JSON changes (debounced)
  useEffect(() => {
    setOriginalValidation(validateJson(debouncedOriginal));
    setOriginalSize(getJsonSizeKB(debouncedOriginal));
  }, [debouncedOriginal]);

  useEffect(() => {
    setModifiedValidation(validateJson(debouncedModified));
    setModifiedSize(getJsonSizeKB(debouncedModified));
  }, [debouncedModified]);

  // Update detailed stats (debounced)
  useEffect(() => {
    if (originalValidation.isValid && modifiedValidation.isValid) {
      setDetailedStats(calculateDetailedDiffStats(debouncedOriginal, debouncedModified));
    } else {
      setDetailedStats({
        added: 0,
        removed: 0,
        modified: 0,
        unchanged: 0,
        total: 0,
      });
    }
  }, [debouncedOriginal, debouncedModified, originalValidation, modifiedValidation]);

  const handleFormat = useCallback(
    async (side: 'original' | 'modified') => {
      try {
        const jsonString = side === 'original' ? original : modified;
        const formatted = await formatJson(jsonString);

        if (side === 'original') {
          setOriginal(formatted);
        } else {
          setModified(formatted);
        }
      } catch (error) {
        toast.error('Cannot format invalid JSON');
      }
    },
    [original, modified]
  );

  const handleSwap = useCallback(() => {
    const temp = original;
    setOriginal(modified);
    setModified(temp);
    toast.success('Swapped left and right JSON');
  }, [original, modified]);

  const handleClear = useCallback((side: 'original' | 'modified' | 'both') => {
    // Save current state for undo
    setUndoState({
      original,
      modified,
      originalFileName,
      modifiedFileName,
    });

    if (side === 'original' || side === 'both') {
      setOriginal('');
      setOriginalFileName(undefined);
    }
    if (side === 'modified' || side === 'both') {
      setModified('');
      setModifiedFileName(undefined);
    }
    setShowClearConfirm(false);
    toast.success('Cleared successfully', {
      action: {
        label: 'Undo',
        onClick: handleUndo,
      },
    });
  }, [original, modified, originalFileName, modifiedFileName]);

  const handleUndo = useCallback(() => {
    if (undoState) {
      setOriginal(undoState.original);
      setModified(undoState.modified);
      setOriginalFileName(undoState.originalFileName);
      setModifiedFileName(undoState.modifiedFileName);
      setUndoState(null);
      toast.success('Undo successful');
    }
  }, [undoState]);


  const handleNextDiff = useCallback(() => {
    if (diffEditorRef.current) {
      // Use Monaco's built-in navigation
      const navigation = (diffEditorRef.current as any).getLineChanges?.();
      if (navigation && navigation.length > 0) {
        const totalDiffs = navigation.length;
        if (currentDiffIndex < totalDiffs - 1) {
          const nextIndex = currentDiffIndex + 1;
          setCurrentDiffIndex(nextIndex);

          // Navigate to the change
          const change = navigation[nextIndex];
          const modifiedEditor = diffEditorRef.current.getModifiedEditor();
          const lineNumber = change.modifiedStartLineNumber || 1;

          modifiedEditor.revealLineInCenter(lineNumber);
          modifiedEditor.setPosition({ lineNumber, column: 1 });
          modifiedEditor.focus();
        }
      }
    }
  }, [currentDiffIndex]);

  const handlePreviousDiff = useCallback(() => {
    if (diffEditorRef.current && currentDiffIndex > 0) {
      const navigation = (diffEditorRef.current as any).getLineChanges?.();
      if (navigation && navigation.length > 0) {
        const prevIndex = currentDiffIndex - 1;
        setCurrentDiffIndex(prevIndex);

        // Navigate to the change
        const change = navigation[prevIndex];
        const modifiedEditor = diffEditorRef.current.getModifiedEditor();
        const lineNumber = change.modifiedStartLineNumber || 1;

        modifiedEditor.revealLineInCenter(lineNumber);
        modifiedEditor.setPosition({ lineNumber, column: 1 });
        modifiedEditor.focus();
      }
    }
  }, [currentDiffIndex]);

  const handleApplyPreset = useCallback((preset: 'strict' | 'flexible' | 'api' | 'config') => {
    const presets = {
      strict: {
        ignoreKeyOrder: false,
        ignoreArrayOrder: false,
        sortKeys: false,
        ignoreKeys: [],
        description: 'Compare everything exactly'
      },
      flexible: {
        ignoreKeyOrder: true,
        ignoreArrayOrder: true,
        sortKeys: true,
        ignoreKeys: [],
        description: 'Ignore order differences'
      },
      api: {
        ignoreKeyOrder: false,
        ignoreArrayOrder: false,
        sortKeys: false,
        ignoreKeys: ['timestamp', 'id', '_id', 'createdAt', 'updatedAt', 'created_at', 'updated_at'],
        description: 'Ignore common API metadata fields'
      },
      config: {
        ignoreKeyOrder: true,
        ignoreArrayOrder: false,
        sortKeys: true,
        ignoreKeys: ['version', 'timestamp', 'lastModified'],
        description: 'For configuration files'
      }
    };

    const selectedPreset = presets[preset];
    setDiffOptions({
      ignoreKeyOrder: selectedPreset.ignoreKeyOrder,
      ignoreArrayOrder: selectedPreset.ignoreArrayOrder,
      sortKeys: selectedPreset.sortKeys,
      ignoreKeys: selectedPreset.ignoreKeys,
    });
    setIgnoreKeysInput(selectedPreset.ignoreKeys.join(', '));
    toast.success(`Applied "${preset}" preset: ${selectedPreset.description}`);
  }, []);

  const [copiedState, setCopiedState] = useState<{ original: boolean; modified: boolean; both: boolean }>({
    original: false,
    modified: false,
    both: false,
  });

  const handleCopy = useCallback(
    async (side: 'original' | 'modified' | 'both') => {
      try {
        let textToCopy = '';
        if (side === 'original') {
          textToCopy = original;
        } else if (side === 'modified') {
          textToCopy = modified;
        } else {
          textToCopy = `ORIGINAL:\n${original}\n\nMODIFIED:\n${modified}`;
        }

        await navigator.clipboard.writeText(textToCopy);

        // Set copied state to trigger animation
        setCopiedState(prev => ({ ...prev, [side]: true }));

        // Reset after 2 seconds
        setTimeout(() => {
          setCopiedState(prev => ({ ...prev, [side]: false }));
        }, 2000);
      } catch (error) {
        toast.error('Failed to copy to clipboard');
      }
    },
    [original, modified]
  );

  const handleDownload = useCallback(
    (side: 'original' | 'modified' | 'both') => {
      const createDownload = (content: string, filename: string) => {
        const blob = new Blob([content], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
      };

      if (side === 'original') {
        createDownload(original, 'original.json');
      } else if (side === 'modified') {
        createDownload(modified, 'modified.json');
      } else {
        createDownload(
          JSON.stringify({ original: JSON.parse(original), modified: JSON.parse(modified) }, null, 2),
          'diff.json'
        );
      }
    },
    [original, modified]
  );

  const handleApplyOptions = useCallback(() => {
    if (!originalValidation.isValid || !modifiedValidation.isValid) {
      toast.error('Please fix JSON errors before applying options');
      return;
    }

    const options: DiffOptions = {
      ...diffOptions,
      ignoreKeys: ignoreKeysInput
        .split(',')
        .map((k) => k.trim())
        .filter(Boolean),
    };

    const processedOriginal = processJsonForDiff(original, options);
    const processedModified = processJsonForDiff(modified, options);

    setOriginal(processedOriginal);
    setModified(processedModified);
    toast.success('Options applied successfully');
  }, [original, modified, diffOptions, ignoreKeysInput, originalValidation, modifiedValidation]);

  const handleExport = useCallback(
    (format: 'html' | 'markdown' | 'text') => {
      if (!canCompare) {
        toast.error('Please fix JSON errors before exporting');
        return;
      }

      try {
        const title = 'JSON Diff Comparison';
        switch (format) {
          case 'html':
            exportAsHtml(original, modified, title);
            break;
          case 'markdown':
            exportAsMarkdown(original, modified, title);
            break;
          case 'text':
            exportAsText(original, modified, title);
            break;
        }
        toast.success(`Exported as ${format.toUpperCase()} successfully`);
      } catch (error) {
        toast.error(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
    [original, modified]
  );

  const handleLoadFromHistory = useCallback((loadedOriginal: string, loadedModified: string) => {
    setOriginal(loadedOriginal);
    setModified(loadedModified);
    setActiveTab('compare');
  }, []);

  // In JSON mode, require valid JSON on both sides. In text mode, just require content on both sides.
  const canCompare = compareMode === 'json'
    ? originalValidation.isValid && modifiedValidation.isValid && original.trim() !== '' && modified.trim() !== ''
    : original.trim() !== '' && modified.trim() !== '';

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 'b',
      ctrl: true,
      description: 'Format JSON',
      action: () => {
        if (activeTab === 'compare') {
          handleFormat('original');
          setTimeout(() => handleFormat('modified'), 100);
        }
      },
    },
    {
      key: 'd',
      ctrl: true,
      description: 'Toggle diff view',
      action: () => {
        if (activeTab === 'compare' && canCompare) {
          setShowDiff(!showDiff);
        }
      },
    },
    {
      key: 's',
      ctrl: true,
      description: 'Share',
      action: () => {
        if (canCompare) {
          setShowShareDialog(true);
        }
      },
    },
    {
      key: 'k',
      ctrl: true,
      description: 'Clear all',
      action: () => {
        if (activeTab === 'compare') {
          setShowClearConfirm(true);
        }
      },
    },
    {
      key: 'z',
      ctrl: true,
      description: 'Undo clear',
      action: () => {
        if (activeTab === 'compare' && undoState) {
          handleUndo();
        }
      },
    },
    {
      key: '1',
      ctrl: true,
      description: 'Go to Compare',
      action: () => setActiveTab('compare'),
    },
    {
      key: '2',
      ctrl: true,
      description: 'Go to Convert',
      action: () => setActiveTab('convert'),
    },
    {
      key: '3',
      ctrl: true,
      description: 'Go to Validate',
      action: () => setActiveTab('validate'),
    },
    {
      key: '4',
      ctrl: true,
      description: 'Go to History',
      action: () => setActiveTab('history'),
    },
    {
      key: 'c',
      ctrl: true,
      shift: true,
      description: 'Copy both JSONs',
      action: () => {
        if (activeTab === 'compare') {
          handleCopy('both');
        }
      },
    },
    {
      key: '?',
      ctrl: false,
      description: 'Show keyboard shortcuts',
      action: () => setShowKeyboardShortcuts(true),
      preventDefault: true,
    },
  ], activeTab === 'compare' || true);

  return (
      <ErrorBoundary>
        <div className="h-screen flex flex-col bg-background overflow-hidden" data-tour="welcome">
          {/* Header */}
          <header className="border-b shrink-0">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileJson className="h-8 w-8 text-primary" />
                  <div>
                    <h1 className="text-2xl font-bold">JSON Differ</h1>
                    <p className="text-sm text-muted-foreground">
                      Compare and analyze JSON differences
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <ThemeSwitcher />
                  <TooltipButton
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowKeyboardShortcuts(true)}
                    tooltip="View all keyboard shortcuts (?)"
                  >
                    <Keyboard className="h-4 w-4" />
                  </TooltipButton>
                  <TooltipButton
                    variant={privacyMode ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setShowPrivacyDialog(true)}
                    tooltip={privacyMode ? "All data stays in your browser. Click to view details." : "Click to learn about privacy mode"}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    {privacyMode ? 'Privacy Mode ON' : 'Privacy Mode OFF'}
                  </TooltipButton>
                </div>
              </div>
            </div>
          </header>

          {/* Main layout with sidebar */}
          <div className="flex flex-1 min-h-0">
            {/* History Sidebar */}
            {activeTab === 'compare' && (
              <HistorySidebar
                onLoadDiff={handleLoadFromHistory}
                currentOriginal={original}
                currentModified={modified}
                isCollapsed={historySidebarCollapsed}
                onToggleCollapse={() => setHistorySidebarCollapsed(!historySidebarCollapsed)}
              />
            )}

            {/* Main content area */}
            <div className="flex-1 overflow-auto px-4 py-4">
            {/* Tabs - Only Compare tab for now */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col">
              {/* <TabsList className="mb-4 shrink-0" data-tour="tabs">
                <TabsTrigger value="compare">
                  <Code className="h-4 w-4 mr-2" />
                  Compare
                </TabsTrigger>
                <TabsTrigger value="convert">
                  <ArrowLeftRight className="h-4 w-4 mr-2" />
                  Convert
                </TabsTrigger>
                <TabsTrigger value="validate">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Validate
                </TabsTrigger>
                <TabsTrigger value="history">
                  <History className="h-4 w-4 mr-2" />
                  History
                </TabsTrigger>
              </TabsList> */}

              <TabsContent value="compare" className="space-y-4">
                {/* Options Dialog */}
                <Dialog open={showSettings} onOpenChange={setShowSettings}>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Comparison Options</DialogTitle>
                      <DialogDescription>
                        Configure how JSONs are compared and apply preset configurations
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                      {/* Presets */}
                      <div>
                        <Label className="text-sm font-medium mb-2 block">Quick Presets</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleApplyPreset('strict')}>
                            <span>🎯 Strict</span>
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleApplyPreset('flexible')}>
                            <span>🔄 Flexible</span>
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleApplyPreset('api')}>
                            <span>🏷️ API Comparison</span>
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleApplyPreset('config')}>
                            <span>⚙️ Config Files</span>
                          </Button>
                        </div>
                      </div>

                      {/* Options */}
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="sortKeys"
                            checked={diffOptions.sortKeys}
                            onCheckedChange={(checked) =>
                              setDiffOptions({ ...diffOptions, sortKeys: !!checked })
                            }
                          />
                          <Label htmlFor="sortKeys" className="text-sm cursor-pointer flex items-center gap-1">
                            Sort keys alphabetically
                            <HelpIcon content="Alphabetically sorts all JSON keys before comparison. Useful when key order doesn't matter." />
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="ignoreArrayOrder"
                            checked={diffOptions.ignoreArrayOrder}
                            onCheckedChange={(checked) =>
                              setDiffOptions({ ...diffOptions, ignoreArrayOrder: !!checked })
                            }
                          />
                          <Label htmlFor="ignoreArrayOrder" className="text-sm cursor-pointer flex items-center gap-1">
                            Ignore array order
                            <HelpIcon content="When enabled, arrays are sorted before comparison, so [1,2,3] will match [3,2,1]." />
                          </Label>
                        </div>

                        <div>
                          <Label htmlFor="ignoreKeys" className="text-sm flex items-center gap-1 mb-2">
                            Ignore specific keys (comma-separated)
                            <HelpIcon content="List keys to exclude from comparison, separated by commas. For example: timestamp, id, created_at. These fields will be ignored in the diff." />
                          </Label>
                          <Input
                            id="ignoreKeys"
                            placeholder="e.g., timestamp, id, created_at"
                            value={ignoreKeysInput}
                            onChange={(e) => setIgnoreKeysInput(e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Apply Button */}
                      <div className="flex justify-end pt-4">
                        <Button onClick={() => { handleApplyOptions(); setShowSettings(false); }}>
                          <Wand2 className="h-4 w-4 mr-2" />
                          Apply Options
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Action Buttons */}
                <div className="relative flex items-center gap-2 mb-4 flex-wrap">
                  {/* Undo button (appears when content was cleared) */}
                  {undoState && (
                    <TooltipButton
                      onClick={handleUndo}
                      variant="default"
                      size="sm"
                      tooltip="Restore the content that was just cleared (Ctrl+Z)"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Undo2 className="h-4 w-4 mr-2" />
                      Undo Clear
                    </TooltipButton>
                  )}

                  {/* Group 1: Data Manipulation - Swap & Mode Toggle */}
                  <div className="flex items-center gap-2 px-2 py-1 bg-muted/30 rounded-lg border border-border/50">
                    <TooltipButton onClick={handleSwap} variant="ghost" size="sm" tooltip="Swap the original and modified content">
                      <ArrowLeftRight className="h-4 w-4 mr-2" />
                      Swap
                    </TooltipButton>

                    <Separator orientation="vertical" className="h-6!" />

                    {/* Mode Toggle - JSON/Text */}
                    <ToggleGroup
                      type="single"
                      value={compareMode}
                      onValueChange={(value) => value && setCompareMode(value as 'json' | 'text')}
                      variant="outline"
                      size="sm"
                    >
                      <ToggleGroupItem value="json" aria-label="JSON mode">
                        <FileJson className="h-3.5 w-3.5 mr-1" />
                        JSON
                      </ToggleGroupItem>
                      <ToggleGroupItem value="text" aria-label="Text mode">
                        <FileText className="h-3.5 w-3.5 mr-1" />
                        Text
                      </ToggleGroupItem>
                    </ToggleGroup>

                    <Separator orientation="vertical" className="h-6!" />
                    <TooltipButton
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowSettings(true)}
                      disabled={compareMode !== 'json'}
                      data-tour="options"
                      tooltip={compareMode === 'json' ? "Configure comparison options and apply presets" : "Options only available in JSON mode"}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Options
                    </TooltipButton>
                  </div>

                  {/* Spacer */}
                  <div className="flex-1" />

                  {/* Group 2: View Toggle - Compare/Show Editors */}
                  <div className="flex items-center gap-2 px-2 py-1 bg-primary/5 rounded-lg border border-primary/20">
                    <TooltipButton
                      onClick={() => setShowDiff(!showDiff)}
                      variant={showDiff ? 'outline' : 'default'}
                      size="default"
                      disabled={!canCompare}
                      data-tour="show-diff"
                      tooltip={showDiff ? "Switch back to split editors" : `Compare ${compareMode === 'json' ? 'JSONs' : 'text'} and highlight differences (Ctrl+D)`}
                      className={`px-6 font-semibold ${!showDiff ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-md' : ''}`}
                    >
                      {showDiff ? (
                        <>
                          <ArrowLeftRight className="h-4 w-4 mr-2" />
                          Show Editors
                        </>
                      ) : (
                        <>
                          <GitCompareArrows className="h-4 w-4 mr-2" />
                          Compare
                        </>
                      )}
                    </TooltipButton>

                    {/* Diff Navigation (appears when comparing) */}
                    {showDiff && canCompare && (detailedStats.added + detailedStats.removed + detailedStats.modified) > 0 && (
                      <>
                        <Separator orientation="vertical" className="h-6!" />
                        <DiffNavigation
                          currentIndex={currentDiffIndex}
                          totalDiffs={detailedStats.added + detailedStats.removed + detailedStats.modified}
                          onNext={handleNextDiff}
                          onPrevious={handlePreviousDiff}
                        />
                      </>
                    )}
                  </div>

                  {/* Spacer */}
                  <div className="flex-1" />

                  {/* Group 3: Actions - Share, Export, Clear */}
                  <div className="flex items-center gap-2 px-2 py-1 bg-muted/30 rounded-lg border border-border/50">
                    <TooltipButton
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowShareDialog(true)}
                      disabled={!canCompare}
                      tooltip={privacyMode
                        ? "Generate a shareable link (data encoded in URL, no server) (Ctrl+S)"
                        : "Save and share your diff online (Ctrl+S)"}
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </TooltipButton>

                    <Separator orientation="vertical" className="h-6!" />

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <TooltipButton variant="ghost" size="sm" disabled={!canCompare} tooltip="Export diff in various formats (JSON, HTML, Markdown, Text)">
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </TooltipButton>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleDownload('both')}>
                          <FileJson className="h-4 w-4 mr-2" />
                          Download as JSON
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleExport('html')}>
                          <Code className="h-4 w-4 mr-2" />
                          Export as HTML
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleExport('markdown')}>
                          <FileText className="h-4 w-4 mr-2" />
                          Export as Markdown
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleExport('text')}>
                          <FileText className="h-4 w-4 mr-2" />
                          Export as Text
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <Separator orientation="vertical" className="h-6!" />

                    <TooltipButton
                      onClick={() => setShowClearConfirm(true)}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                      tooltip="Clear both editors (Ctrl+K)"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear
                    </TooltipButton>
                  </div>
                </div>

                {/* Editor */}
                <JsonDiffEditor
                  original={original}
                  modified={modified}
                  onOriginalChange={setOriginal}
                  onModifiedChange={setModified}
                  showDiff={showDiff}
                  height="calc(100vh - 240px)"
                  originalFileName={originalFileName}
                  modifiedFileName={modifiedFileName}
                  originalSize={originalSize}
                  modifiedSize={modifiedSize}
                  originalValidation={originalValidation}
                  modifiedValidation={modifiedValidation}
                  compareMode={compareMode}
                  originalHeaderActions={
                    showDiff ? (
                      <TooltipButton
                        onClick={() => handleCopy('original')}
                        variant="ghost"
                        size="sm"
                        tooltip={copiedState.original ? "Copied!" : `Copy original ${compareMode === 'json' ? 'JSON' : 'text'} to clipboard`}
                        className={`h-7 w-7 p-0 transition-all ${copiedState.original ? 'bg-green-500/20 scale-110' : ''}`}
                      >
                        {copiedState.original ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </TooltipButton>
                    ) : (
                      <>
                        <CompactFileUploader
                          onLoad={(content, fileName) => {
                            setOriginal(content);
                            setOriginalFileName(fileName);
                          }}
                          accept={compareMode === 'json' ? '.json' : '*'}
                        />
                        <TooltipButton
                          onClick={() => handleFormat('original')}
                          variant="ghost"
                          size="sm"
                          disabled={compareMode !== 'json'}
                          tooltip={compareMode === 'json' ? "Auto-format original JSON (Ctrl+B)" : "Format only available in JSON mode"}
                          className="h-7 w-7 p-0"
                        >
                          <Wand2 className="h-4 w-4" />
                        </TooltipButton>
                      </>
                    )
                  }
                  modifiedHeaderActions={
                    showDiff ? (
                      <TooltipButton
                        onClick={() => handleCopy('modified')}
                        variant="ghost"
                        size="sm"
                        tooltip={copiedState.modified ? "Copied!" : `Copy modified ${compareMode === 'json' ? 'JSON' : 'text'} to clipboard`}
                        className={`h-7 w-7 p-0 transition-all ${copiedState.modified ? 'bg-green-500/20 scale-110' : ''}`}
                      >
                        {copiedState.modified ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </TooltipButton>
                    ) : (
                      <>
                        <CompactFileUploader
                          onLoad={(content, fileName) => {
                            setModified(content);
                            setModifiedFileName(fileName);
                          }}
                          accept={compareMode === 'json' ? '.json' : '*'}
                        />
                        <TooltipButton
                          onClick={() => handleFormat('modified')}
                          variant="ghost"
                          size="sm"
                          disabled={compareMode !== 'json'}
                          tooltip={compareMode === 'json' ? "Auto-format modified JSON (Ctrl+B)" : "Format only available in JSON mode"}
                          className="h-7 w-7 p-0"
                        >
                          <Wand2 className="h-4 w-4" />
                        </TooltipButton>
                      </>
                    )
                  }
                  onDiffEditorMount={(editor) => {
                    diffEditorRef.current = editor;
                    // Reset the current diff index when editor mounts
                    setCurrentDiffIndex(0);
                  }}
                />
              </TabsContent>

              {/* Other tabs commented out for now
              <TabsContent value="convert">
                <FormatConverterPanel />
              </TabsContent>

              <TabsContent value="validate">
                <div className="space-y-4">
                  <Card className="p-4 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-600">Select JSON to Validate</p>
                        <p className="text-sm text-blue-600/80 mt-1">
                          Choose which JSON you want to validate against a schema
                        </p>
                        <div className="flex gap-2 mt-3">
                          <TooltipButton
                            size="sm"
                            variant={activeTab === 'validate' ? 'default' : 'outline'}
                            onClick={() => {
                              // Already on validate tab, will validate original by default
                            }}
                            tooltip="Validate the original JSON against a schema"
                          >
                            Validate Original JSON
                          </TooltipButton>
                          <TooltipButton
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              // Will validate modified JSON
                            }}
                            tooltip="Validate the modified JSON against a schema"
                          >
                            Validate Modified JSON
                          </TooltipButton>
                        </div>
                      </div>
                    </div>
                  </Card>

                  <SchemaValidatorPanel json={original} />
                </div>
              </TabsContent>
              <TabsContent value="history">
                <LocalHistory
                  onLoadDiff={handleLoadFromHistory}
                  currentOriginal={original}
                  currentModified={modified}
                />
              </TabsContent>
              */}
            </Tabs>
            </div>
          </div>

          {/* Share Dialog - URL-based for privacy mode, server-based otherwise */}
          {privacyMode ? (
            <ShareLinkDialog
              open={showShareDialog}
              onOpenChange={setShowShareDialog}
              originalJson={original}
              modifiedJson={modified}
            />
          ) : (
            <ShareDialog
              open={showShareDialog}
              onOpenChange={setShowShareDialog}
              originalContent={original}
              modifiedContent={modified}
              diffType={compareMode}
            />
          )}

          {/* Keyboard Shortcuts Dialog */}
          <KeyboardShortcutsDialog
            open={showKeyboardShortcuts}
            onOpenChange={setShowKeyboardShortcuts}
          />

          {/* Clear Confirmation Dialog */}
          <ConfirmDialog
            open={showClearConfirm}
            onOpenChange={setShowClearConfirm}
            onConfirm={() => handleClear('both')}
            title="Clear Both Editors?"
            description="This will remove all content from both the original and modified JSON editors. This action cannot be undone."
            confirmText="Clear All"
            cancelText="Cancel"
            variant="destructive"
          />

          {/* Privacy Mode Dialog */}
          <Dialog open={showPrivacyDialog} onOpenChange={setShowPrivacyDialog}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Shield className={`h-5 w-5 ${privacyMode ? 'text-green-600' : 'text-muted-foreground'}`} />
                  Privacy Mode
                </DialogTitle>
                <DialogDescription>
                  Control how your data is handled when using the differ
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {privacyMode ? (
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-sm font-medium text-green-600">Privacy Mode is ON</span>
                    </div>
                    <ul className="text-sm text-green-600/80 space-y-1.5 ml-4">
                      <li>• All processing happens in your browser</li>
                      <li>• No data is sent to our servers</li>
                      <li>• Shared links encode data in the URL</li>
                      <li>• History is stored locally only</li>
                    </ul>
                  </div>
                ) : (
                  <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-2 w-2 rounded-full bg-amber-500" />
                      <span className="text-sm font-medium text-amber-600">Privacy Mode is OFF</span>
                    </div>
                    <ul className="text-sm text-amber-600/80 space-y-1.5 ml-4">
                      <li>• Shared diffs are stored on our servers</li>
                      <li>• Links are shorter and easier to share</li>
                      <li>• View count tracking is enabled</li>
                      <li>• Diffs can be accessed by anyone with the link</li>
                    </ul>
                  </div>
                )}

                <div className="flex justify-between items-center pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowPrivacyDialog(false)}
                  >
                    Close
                  </Button>
                  <Button
                    variant={privacyMode ? 'outline' : 'default'}
                    onClick={() => {
                      setPrivacyMode(!privacyMode);
                      setShowPrivacyDialog(false);
                    }}
                  >
                    {privacyMode ? 'Turn Off Privacy Mode' : 'Turn On Privacy Mode'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </ErrorBoundary>
  );
}

export default function DifferPage() {
  return (
    <Suspense fallback={<EditorLoading height="100vh" showDualEditor={true} />}>
      <DifferPageContent />
    </Suspense>
  );
}
