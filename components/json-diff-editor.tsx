'use client';

import { DiffEditor, Editor } from '@monaco-editor/react';
import { useTheme } from 'next-themes';
import { useEffect, useState, useRef } from 'react';
import type { editor } from 'monaco-editor';
import { Card } from '@/components/ui/card';

interface ValidationResult {
  isValid: boolean;
  error?: string;
  lineNumber?: number;
}

interface JsonDiffEditorProps {
  original: string;
  modified: string;
  onOriginalChange?: (value: string) => void;
  onModifiedChange?: (value: string) => void;
  readOnly?: boolean;
  height?: string;
  showDiff?: boolean;
  originalFileName?: string;
  modifiedFileName?: string;
  originalHeaderActions?: React.ReactNode;
  modifiedHeaderActions?: React.ReactNode;
  onDiffEditorMount?: (editor: editor.IStandaloneDiffEditor) => void;
  originalSize?: number;
  modifiedSize?: number;
  originalValidation?: ValidationResult;
  modifiedValidation?: ValidationResult;
  compareMode?: 'json' | 'text';
}

export function JsonDiffEditor({
  original,
  modified,
  onOriginalChange,
  onModifiedChange,
  readOnly = false,
  height = '600px',
  showDiff = false,
  originalFileName,
  modifiedFileName,
  originalHeaderActions,
  modifiedHeaderActions,
  onDiffEditorMount,
  originalSize = 0,
  modifiedSize = 0,
  originalValidation = { isValid: true },
  modifiedValidation = { isValid: true },
  compareMode = 'json',
}: JsonDiffEditorProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const diffEditorRef = useRef<editor.IStandaloneDiffEditor | null>(null);

  useEffect(() => {
    setMounted(true);

    // Cleanup on unmount to prevent Monaco disposal errors during HMR
    return () => {
      if (diffEditorRef.current) {
        try {
          diffEditorRef.current.dispose();
        } catch {
          // Ignore disposal errors during HMR
        }
        diffEditorRef.current = null;
      }
    };
  }, []);

  const editorOptions = {
    readOnly,
    minimap: {
      enabled: true,
      maxColumn: 80,
      renderCharacters: false, // Faster rendering
      showSlider: 'mouseover' as const,
    },
    fontSize: 14,
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Menlo, Monaco, 'Courier New', monospace",
    fontLigatures: true, // Enable font ligatures for better code readability
    lineNumbers: 'on' as const,
    scrollBeyondLastLine: false,
    automaticLayout: true,
    wordWrap: 'on' as const,
    formatOnPaste: true,
    formatOnType: true,
    // Enhanced features
    bracketPairColorization: {
      enabled: true, // Color-code matching brackets
    },
    guides: {
      bracketPairs: true, // Show guides for bracket pairs
      indentation: true, // Show indentation guides
    },
    smoothScrolling: true,
    cursorSmoothCaretAnimation: 'on' as const,
    cursorBlinking: 'smooth' as const,
    // Performance improvements
    suggest: {
      enabled: true,
      showSnippets: true,
    },
    quickSuggestions: {
      other: true,
      comments: false,
      strings: true,
    },
    // Better readability
    renderWhitespace: 'boundary' as const,
    renderLineHighlight: 'all' as const,
    // Better selection
    selectionHighlight: true,
    occurrencesHighlight: 'multiFile' as const,
  };

  const diffEditorOptions = {
    ...editorOptions,
    renderSideBySide: true,
    enableSplitViewResizing: true,
    renderOverviewRuler: false,
    padding: { top: 0, bottom: 0 },
    lineNumbersMinChars: 2,
    // Fix for word wrap not working on left/original side
    // See: https://github.com/microsoft/monaco-editor/discussions/4454
    useInlineViewWhenSpaceIsLimited: false,
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div
        className="border rounded-lg bg-muted animate-pulse"
        style={{ height }}
      />
    );
  }

  if (showDiff) {
    return (
      <div className="relative" style={{ height }}>
        {/* Enhanced gradient background blur effect */}
        <div className="absolute -inset-4 bg-gradient-to-r from-primary/30 via-primary/20 to-primary/30 rounded-2xl blur-3xl -z-10 opacity-60" />
        <div className="absolute -inset-2 bg-gradient-to-br from-primary/10 to-transparent rounded-xl -z-10" />

        <Card className="h-full p-1.5 bg-gradient-to-br from-primary/15 via-background to-primary/5 border-2 border-primary/20 shadow-xl shadow-primary/5">
          <div className="h-full bg-card rounded-lg overflow-hidden flex flex-col shadow-inner">
            {/* Panel Headers for Original and Modified */}
            <div className="grid grid-cols-2 border-b">
              {/* Original Header */}
              <div className={`px-4 py-2.5 flex flex-col gap-1 border-r-2 border-primary/10 ${compareMode === 'json' && !originalValidation.isValid ? 'bg-red-500/10' : 'bg-gradient-to-r from-muted/30 to-transparent'}`}>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={`w-2 h-2 rounded-full ${compareMode === 'text' || originalValidation.isValid ? 'bg-blue-500' : 'bg-red-500'}`} />
                    <span className="text-xs font-medium text-foreground/80">Original {compareMode === 'json' ? 'JSON' : 'Text'}</span>
                    {originalFileName && (
                      <span className="text-xs text-muted-foreground font-normal truncate max-w-[100px]">• {originalFileName}</span>
                    )}
                    <span className="text-xs text-muted-foreground/70 font-normal">({originalSize} KB)</span>
                  </div>
                  {originalHeaderActions && (
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {originalHeaderActions}
                    </div>
                  )}
                </div>
                {compareMode === 'json' && !originalValidation.isValid && (
                  <div className="text-xs text-red-600 dark:text-red-400 truncate">
                    {originalValidation.error}{originalValidation.lineNumber && ` (Line ${originalValidation.lineNumber})`}
                  </div>
                )}
              </div>
              {/* Modified Header */}
              <div className={`px-4 py-2.5 flex flex-col gap-1 ${compareMode === 'json' && !modifiedValidation.isValid ? 'bg-red-500/10' : 'bg-gradient-to-r from-muted/30 to-transparent'}`}>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={`w-2 h-2 rounded-full ${compareMode === 'text' || modifiedValidation.isValid ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-xs font-medium text-foreground/80">Modified {compareMode === 'json' ? 'JSON' : 'Text'}</span>
                    {modifiedFileName && (
                      <span className="text-xs text-muted-foreground font-normal truncate max-w-[100px]">• {modifiedFileName}</span>
                    )}
                    <span className="text-xs text-muted-foreground/70 font-normal">({modifiedSize} KB)</span>
                  </div>
                  {modifiedHeaderActions && (
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {modifiedHeaderActions}
                    </div>
                  )}
                </div>
                {compareMode === 'json' && !modifiedValidation.isValid && (
                  <div className="text-xs text-red-600 dark:text-red-400 truncate">
                    {modifiedValidation.error}{modifiedValidation.lineNumber && ` (Line ${modifiedValidation.lineNumber})`}
                  </div>
                )}
              </div>
            </div>

            {/* Diff Editor */}
            <div className="flex-1 relative diff-editor-compact">
              <DiffEditor
                height="100%"
                language={compareMode === 'json' ? 'json' : 'plaintext'}
                original={original}
                modified={modified}
                theme={theme === 'dark' ? 'vs-dark' : 'light'}
                options={diffEditorOptions}
                onMount={(editor) => {
                  diffEditorRef.current = editor;
                  onDiffEditorMount?.(editor);
                }}
                loading={
                  <div className="flex items-center justify-center h-full bg-muted/20">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                      <p className="text-sm text-muted-foreground">Loading editor...</p>
                    </div>
                  </div>
                }
              />
            </div>

            {/* Editor Footer */}
            <div className="px-4 py-2.5 border-t bg-gradient-to-r from-muted/50 to-muted/30 flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-medium">Comparing {compareMode === 'json' ? 'JSON' : 'text'} files</span>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span>Monaco Editor • VS Code Powered</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative" style={{ height }}>
      {/* Enhanced gradient background blur effect */}
      <div className="absolute -inset-4 bg-gradient-to-r from-primary/30 via-primary/20 to-primary/30 rounded-2xl blur-3xl -z-10 opacity-60" />
      <div className="absolute -inset-2 bg-gradient-to-br from-primary/10 to-transparent rounded-xl -z-10" />

      <Card className="h-full p-1.5 bg-gradient-to-br from-primary/15 via-background to-primary/5 border-2 border-primary/20 shadow-xl shadow-primary/5">
        <div className="h-full bg-card rounded-lg overflow-hidden flex flex-col shadow-inner">
          {/* Split Editor View */}
          <div className="flex-1 grid grid-cols-2">
            {/* Left Panel - Original */}
            <div className="flex flex-col bg-background/50 relative border-r-2 border-primary/10">
              <div className={`px-4 py-2.5 border-b flex flex-col gap-1 ${compareMode === 'json' && !originalValidation.isValid ? 'bg-red-500/10' : 'bg-gradient-to-r from-muted/30 to-transparent'}`}>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={`w-2 h-2 rounded-full ${compareMode === 'text' || originalValidation.isValid ? 'bg-blue-500' : 'bg-red-500'}`} />
                    <span className="text-xs font-medium text-foreground/80">Original {compareMode === 'json' ? 'JSON' : 'Text'}</span>
                    {originalFileName && (
                      <span className="text-xs text-muted-foreground font-normal truncate max-w-[100px]">• {originalFileName}</span>
                    )}
                    <span className="text-xs text-muted-foreground/70 font-normal">({originalSize} KB)</span>
                  </div>
                  {originalHeaderActions && (
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {originalHeaderActions}
                    </div>
                  )}
                </div>
                {compareMode === 'json' && !originalValidation.isValid && (
                  <div className="text-xs text-red-600 dark:text-red-400 truncate">
                    {originalValidation.error}{originalValidation.lineNumber && ` (Line ${originalValidation.lineNumber})`}
                  </div>
                )}
              </div>
              <div className="flex-1 relative">
                {!original.trim() && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 bg-background/70">
                    <div className="text-center space-y-3 text-muted-foreground px-6 py-8 rounded-lg bg-muted/30 border border-dashed border-muted-foreground/20">
                      <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-2xl">{compareMode === 'json' ? '📄' : '📝'}</span>
                      </div>
                      <p className="text-sm font-medium">Paste your {compareMode === 'json' ? 'JSON' : 'text'} here</p>
                      <p className="text-xs">or drag & drop a file</p>
                      {compareMode === 'json' && <p className="text-xs text-primary/70 italic">Tip: Press Ctrl+B to format</p>}
                    </div>
                  </div>
                )}
                <Editor
                  height="100%"
                  language={compareMode === 'json' ? 'json' : 'plaintext'}
                  value={original}
                  onChange={(value) => onOriginalChange?.(value || '')}
                  theme={theme === 'dark' ? 'vs-dark' : 'light'}
                  options={editorOptions}
                  loading={
                    <div className="flex items-center justify-center h-full bg-muted/20">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                        <p className="text-sm text-muted-foreground">Loading...</p>
                      </div>
                    </div>
                  }
                />
              </div>
            </div>

            {/* Right Panel - Modified */}
            <div className="flex flex-col bg-background/50 relative">
              <div className={`px-4 py-2.5 border-b flex flex-col gap-1 ${compareMode === 'json' && !modifiedValidation.isValid ? 'bg-red-500/10' : 'bg-gradient-to-r from-muted/30 to-transparent'}`}>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={`w-2 h-2 rounded-full ${compareMode === 'text' || modifiedValidation.isValid ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-xs font-medium text-foreground/80">Modified {compareMode === 'json' ? 'JSON' : 'Text'}</span>
                    {modifiedFileName && (
                      <span className="text-xs text-muted-foreground font-normal truncate max-w-[100px]">• {modifiedFileName}</span>
                    )}
                    <span className="text-xs text-muted-foreground/70 font-normal">({modifiedSize} KB)</span>
                  </div>
                  {modifiedHeaderActions && (
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {modifiedHeaderActions}
                    </div>
                  )}
                </div>
                {compareMode === 'json' && !modifiedValidation.isValid && (
                  <div className="text-xs text-red-600 dark:text-red-400 truncate">
                    {modifiedValidation.error}{modifiedValidation.lineNumber && ` (Line ${modifiedValidation.lineNumber})`}
                  </div>
                )}
              </div>
              <div className="flex-1 relative">
                {!modified.trim() && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 bg-background/70">
                    <div className="text-center space-y-3 text-muted-foreground px-6 py-8 rounded-lg bg-muted/30 border border-dashed border-muted-foreground/20">
                      <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-2xl">{compareMode === 'json' ? '📝' : '📄'}</span>
                      </div>
                      <p className="text-sm font-medium">Paste your modified {compareMode === 'json' ? 'JSON' : 'text'} here</p>
                      <p className="text-xs">or drag & drop a file</p>
                    </div>
                  </div>
                )}
                <Editor
                  height="100%"
                  language={compareMode === 'json' ? 'json' : 'plaintext'}
                  value={modified}
                  onChange={(value) => onModifiedChange?.(value || '')}
                  theme={theme === 'dark' ? 'vs-dark' : 'light'}
                  options={editorOptions}
                  loading={
                    <div className="flex items-center justify-center h-full bg-muted/20">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                        <p className="text-sm text-muted-foreground">Loading...</p>
                      </div>
                    </div>
                  }
                />
              </div>
            </div>
          </div>

          {/* Editor Footer */}
          <div className="px-4 py-2.5 border-t bg-gradient-to-r from-muted/50 to-muted/30 flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-medium">Ready to compare {compareMode === 'json' ? 'JSON' : 'text'}</span>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span>Monaco Editor • VS Code Powered</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
