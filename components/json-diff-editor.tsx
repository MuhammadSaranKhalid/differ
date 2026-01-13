'use client';

import { DiffEditor, Editor } from '@monaco-editor/react';
import { useTheme } from 'next-themes';
import { useEffect, useState, useRef } from 'react';
import type { editor } from 'monaco-editor';

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
}: JsonDiffEditorProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const diffEditorRef = useRef<editor.IStandaloneDiffEditor | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const editorOptions = {
    readOnly,
    minimap: { enabled: true },
    fontSize: 14,
    lineNumbers: 'on' as const,
    scrollBeyondLastLine: false,
    automaticLayout: true,
    wordWrap: 'on' as const,
    formatOnPaste: true,
    formatOnType: true,
  };

  const diffEditorOptions = {
    ...editorOptions,
    renderSideBySide: true,
    enableSplitViewResizing: true,
    renderOverviewRuler: false,
    padding: { top: 0, bottom: 0 },
    // folding: false,
    // glyphMargin: false,
    lineNumbersMinChars: 2,
    // lineDecorationsWidth: 0,
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
      <div className="border rounded-lg overflow-hidden flex flex-col" style={{ height }}>
        {/* Diff Editor */}
        <div className="flex-1 relative diff-editor-compact">
          <DiffEditor
            height="100%"
            language="json"
            original={original}
            modified={modified}
            theme={theme === 'dark' ? 'vs-dark' : 'light'}
            options={diffEditorOptions}
            onMount={(editor) => {
              diffEditorRef.current = editor;
              onDiffEditorMount?.(editor);
            }}
            loading={
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Loading editor...</p>
              </div>
            }
          />
          {/* Copy Buttons Overlay - positioned after editor to have higher z-index */}
          <div className="absolute top-2 left-0 right-0 pointer-events-none" style={{ zIndex: 1000 }}>
            <div className="grid grid-cols-2 px-4">
              <div className="flex justify-end pr-12 pointer-events-auto">
                {originalHeaderActions}
              </div>
              <div className="flex justify-end pr-4 pointer-events-auto">
                {modifiedHeaderActions}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4" style={{ height }}>
      <div className="border rounded-lg overflow-hidden relative">
        <div className="bg-muted px-3 py-1.5 text-sm font-medium border-b flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm">Original JSON</span>
            {originalFileName && (
              <span className="text-xs text-muted-foreground font-normal truncate">{originalFileName}</span>
            )}
          </div>
          {originalHeaderActions && (
            <div className="flex items-center gap-1 flex-shrink-0">
              {originalHeaderActions}
            </div>
          )}
        </div>
        {!original.trim() && (
          <div className="absolute inset-0 top-[37px] flex items-center justify-center pointer-events-none z-10 bg-background/50">
            <div className="text-center space-y-2 text-muted-foreground px-4">
              <p className="text-sm font-medium">Paste your JSON here</p>
              <p className="text-xs">or drag & drop a .json file</p>
              <p className="text-xs italic">Tip: Press Ctrl+B to format minified JSON</p>
            </div>
          </div>
        )}
        <Editor
          height={`calc(${height} - 37px)`}
          language="json"
          value={original}
          onChange={(value) => onOriginalChange?.(value || '')}
          theme={theme === 'dark' ? 'vs-dark' : 'light'}
          options={editorOptions}
          loading={
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          }
        />
      </div>

      <div className="border rounded-lg overflow-hidden relative">
        <div className="bg-muted px-3 py-1.5 text-sm font-medium border-b flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm">Modified JSON</span>
            {modifiedFileName && (
              <span className="text-xs text-muted-foreground font-normal truncate">{modifiedFileName}</span>
            )}
          </div>
          {modifiedHeaderActions && (
            <div className="flex items-center gap-1 flex-shrink-0">
              {modifiedHeaderActions}
            </div>
          )}
        </div>
        {!modified.trim() && (
          <div className="absolute inset-0 top-[37px] flex items-center justify-center pointer-events-none z-10 bg-background/50">
            <div className="text-center space-y-2 text-muted-foreground px-4">
              <p className="text-sm font-medium">Paste your modified JSON here</p>
              <p className="text-xs">or drag & drop a .json file</p>
            </div>
          </div>
        )}
        <Editor
          height={`calc(${height} - 37px)`}
          language="json"
          value={modified}
          onChange={(value) => onModifiedChange?.(value || '')}
          theme={theme === 'dark' ? 'vs-dark' : 'light'}
          options={editorOptions}
          loading={
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          }
        />
      </div>
    </div>
  );
}
