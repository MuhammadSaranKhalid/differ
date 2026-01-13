'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Keyboard } from 'lucide-react';

interface KeyboardShortcutsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ShortcutGroup {
  title: string;
  shortcuts: Array<{
    keys: string[];
    description: string;
  }>;
}

const SHORTCUT_GROUPS: ShortcutGroup[] = [
  {
    title: 'Editor Actions',
    shortcuts: [
      { keys: ['Ctrl', 'B'], description: 'Format/Beautify JSON' },
      { keys: ['Ctrl', 'D'], description: 'Show/Hide Diff view' },
      { keys: ['Ctrl', 'S'], description: 'Save & Share' },
      { keys: ['Ctrl', 'K'], description: 'Clear all editors' },
    ],
  },
  {
    title: 'Navigation',
    shortcuts: [
      { keys: ['Ctrl', '1'], description: 'Go to Compare tab' },
      { keys: ['Ctrl', '2'], description: 'Go to Convert tab' },
      { keys: ['Ctrl', '3'], description: 'Go to Validate tab' },
      { keys: ['Ctrl', '4'], description: 'Go to History tab' },
    ],
  },
  {
    title: 'Clipboard',
    shortcuts: [
      { keys: ['Ctrl', 'C'], description: 'Copy selected text' },
      { keys: ['Ctrl', 'Shift', 'C'], description: 'Copy both JSONs' },
    ],
  },
  {
    title: 'General',
    shortcuts: [
      { keys: ['?'], description: 'Show keyboard shortcuts' },
      { keys: ['Esc'], description: 'Close dialogs' },
    ],
  },
];

export function KeyboardShortcutsDialog({ open, onOpenChange }: KeyboardShortcutsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            <DialogTitle>Keyboard Shortcuts</DialogTitle>
          </div>
          <DialogDescription>
            Speed up your workflow with these keyboard shortcuts
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {SHORTCUT_GROUPS.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold mb-3">{group.title}</h3>
              <div className="space-y-2">
                {group.shortcuts.map((shortcut, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/50"
                  >
                    <span className="text-sm text-muted-foreground">
                      {shortcut.description}
                    </span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, keyIndex) => (
                        <div key={keyIndex} className="flex items-center">
                          <Badge
                            variant="outline"
                            className="font-mono text-xs px-2 py-1"
                          >
                            {key}
                          </Badge>
                          {keyIndex < shortcut.keys.length - 1 && (
                            <span className="mx-1 text-muted-foreground">+</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-xs text-muted-foreground text-center pt-4 border-t">
          <p>
            <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl</kbd> on Windows/Linux,{' '}
            <kbd className="px-2 py-1 bg-muted rounded text-xs">⌘</kbd> on Mac
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
