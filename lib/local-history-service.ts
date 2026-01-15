import { calculateDetailedDiffStats, getJsonSizeKB, type DetailedDiffStats } from './json-utils';

const STORAGE_KEY = 'json-differ-history';
const MAX_ENTRIES = 50;
const MAX_STORAGE_MB = 5;

export interface LocalHistoryEntry {
  id: string;
  original: string;
  modified: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  originalSize: number;
  modifiedSize: number;
  stats: DetailedDiffStats;
  preview: {
    originalKeys: string[];
    modifiedKeys: string[];
  };
  isPinned: boolean;
}

/**
 * Generate a unique ID for history entries
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Extract top-level keys from JSON for preview
 */
function extractTopKeys(jsonString: string, maxKeys: number = 5): string[] {
  try {
    const parsed = JSON.parse(jsonString);
    if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
      return Object.keys(parsed).slice(0, maxKeys);
    }
    if (Array.isArray(parsed)) {
      return [`Array[${parsed.length}]`];
    }
    return [typeof parsed];
  } catch {
    return [];
  }
}

/**
 * Auto-generate a name based on current date/time
 * Format: "Jan 16, 2:13 AM"
 */
function generateAutoName(): string {
  const now = new Date();
  return now.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  }) + ', ' + now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Get all history entries from localStorage
 */
export function getLocalHistory(): LocalHistoryEntry[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const entries: LocalHistoryEntry[] = JSON.parse(stored);
    // Sort by pinned first, then by date
    return entries.sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  } catch {
    return [];
  }
}

/**
 * Save a new history entry
 */
export function saveToLocalHistory(
  original: string,
  modified: string,
  customName?: string
): { success: boolean; entry?: LocalHistoryEntry; error?: string } {
  if (typeof window === 'undefined') {
    return { success: false, error: 'Not in browser environment' };
  }

  try {
    const entries = getLocalHistory();

    // Check storage limit
    const storageInfo = getStorageInfo();
    if (storageInfo.usedMB >= MAX_STORAGE_MB) {
      // Remove oldest non-pinned entry
      const oldestUnpinned = entries.filter(e => !e.isPinned).pop();
      if (oldestUnpinned) {
        deleteFromLocalHistory(oldestUnpinned.id);
      } else {
        return { success: false, error: 'Storage limit reached. Unpin some entries to save new ones.' };
      }
    }

    const stats = calculateDetailedDiffStats(original, modified);

    const newEntry: LocalHistoryEntry = {
      id: generateId(),
      original,
      modified,
      name: customName || generateAutoName(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      originalSize: getJsonSizeKB(original),
      modifiedSize: getJsonSizeKB(modified),
      stats,
      preview: {
        originalKeys: extractTopKeys(original),
        modifiedKeys: extractTopKeys(modified),
      },
      isPinned: false,
    };

    // Add to beginning (most recent first)
    const updatedEntries = [newEntry, ...entries];

    // Limit total entries
    const trimmedEntries = updatedEntries.slice(0, MAX_ENTRIES);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedEntries));

    return { success: true, entry: newEntry };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save to history'
    };
  }
}

/**
 * Delete a history entry
 */
export function deleteFromLocalHistory(id: string): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const entries = getLocalHistory();
    const filtered = entries.filter(e => e.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch {
    return false;
  }
}

/**
 * Update a history entry (rename, pin/unpin)
 */
export function updateLocalHistoryEntry(
  id: string,
  updates: Partial<Pick<LocalHistoryEntry, 'name' | 'isPinned'>>
): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const entries = getLocalHistory();
    const index = entries.findIndex(e => e.id === id);

    if (index === -1) return false;

    entries[index] = {
      ...entries[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    return true;
  } catch {
    return false;
  }
}

/**
 * Clear all history entries
 */
export function clearLocalHistory(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get storage usage information
 */
export function getStorageInfo(): {
  usedMB: number;
  maxMB: number;
  percentage: number;
  entryCount: number;
} {
  if (typeof window === 'undefined') {
    return { usedMB: 0, maxMB: MAX_STORAGE_MB, percentage: 0, entryCount: 0 };
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY) || '';
    const bytes = new Blob([stored]).size;
    const usedMB = Math.round((bytes / (1024 * 1024)) * 100) / 100;
    const entries = getLocalHistory();

    return {
      usedMB,
      maxMB: MAX_STORAGE_MB,
      percentage: Math.round((usedMB / MAX_STORAGE_MB) * 100),
      entryCount: entries.length,
    };
  } catch {
    return { usedMB: 0, maxMB: MAX_STORAGE_MB, percentage: 0, entryCount: 0 };
  }
}

/**
 * Search history entries
 */
export function searchLocalHistory(query: string): LocalHistoryEntry[] {
  const entries = getLocalHistory();
  const lowerQuery = query.toLowerCase();

  return entries.filter(entry => {
    // Search in name
    if (entry.name.toLowerCase().includes(lowerQuery)) return true;

    // Search in preview keys
    if (entry.preview.originalKeys.some(k => k.toLowerCase().includes(lowerQuery))) return true;
    if (entry.preview.modifiedKeys.some(k => k.toLowerCase().includes(lowerQuery))) return true;

    return false;
  });
}

/**
 * Export history as JSON
 */
export function exportLocalHistory(): string {
  const entries = getLocalHistory();
  return JSON.stringify(entries, null, 2);
}

/**
 * Import history from JSON
 */
export function importLocalHistory(jsonString: string): { success: boolean; imported: number; error?: string } {
  if (typeof window === 'undefined') {
    return { success: false, imported: 0, error: 'Not in browser environment' };
  }

  try {
    const imported: LocalHistoryEntry[] = JSON.parse(jsonString);

    if (!Array.isArray(imported)) {
      return { success: false, imported: 0, error: 'Invalid format: expected array' };
    }

    const existing = getLocalHistory();
    const existingIds = new Set(existing.map(e => e.id));

    // Only add entries that don't already exist
    const newEntries = imported.filter(e => !existingIds.has(e.id));
    const merged = [...existing, ...newEntries].slice(0, MAX_ENTRIES);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));

    return { success: true, imported: newEntries.length };
  } catch (error) {
    return {
      success: false,
      imported: 0,
      error: error instanceof Error ? error.message : 'Failed to import'
    };
  }
}
