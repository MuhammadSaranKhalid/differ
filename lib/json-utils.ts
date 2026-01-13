export interface JsonValidationResult {
  isValid: boolean;
  error?: string;
  lineNumber?: number;
  columnNumber?: number;
}

export interface DiffOptions {
  ignoreKeyOrder?: boolean;
  ignoreArrayOrder?: boolean;
  ignoreKeys?: string[];
  sortKeys?: boolean;
}

/**
 * Validates JSON string and returns detailed error information
 */
export function validateJson(jsonString: string): JsonValidationResult {
  if (!jsonString || jsonString.trim() === '') {
    return {
      isValid: true,
    };
  }

  try {
    JSON.parse(jsonString);
    return { isValid: true };
  } catch (error) {
    if (error instanceof SyntaxError) {
      // Try to extract line number from error message
      const match = error.message.match(/position (\d+)/);
      if (match) {
        const position = parseInt(match[1], 10);
        const lines = jsonString.substring(0, position).split('\n');
        const lineNumber = lines.length;
        const columnNumber = lines[lines.length - 1].length + 1;

        return {
          isValid: false,
          error: error.message,
          lineNumber,
          columnNumber,
        };
      }

      return {
        isValid: false,
        error: error.message,
      };
    }

    return {
      isValid: false,
      error: 'Unknown JSON parsing error',
    };
  }
}

/**
 * Formats JSON string with proper indentation
 */
export async function formatJson(jsonString: string, tabSize: number = 2): Promise<string> {
  try {
    const parsed = JSON.parse(jsonString);
    return JSON.stringify(parsed, null, tabSize);
  } catch (error) {
    throw new Error('Cannot format invalid JSON');
  }
}

/**
 * Minifies JSON string
 */
export function minifyJson(jsonString: string): string {
  try {
    const parsed = JSON.parse(jsonString);
    return JSON.stringify(parsed);
  } catch (error) {
    throw new Error('Cannot minify invalid JSON');
  }
}

/**
 * Sorts JSON keys alphabetically (recursively)
 */
export function sortJsonKeys(obj: any): any {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(sortJsonKeys);
  }

  const sorted: any = {};
  Object.keys(obj)
    .sort()
    .forEach((key) => {
      sorted[key] = sortJsonKeys(obj[key]);
    });

  return sorted;
}

/**
 * Processes JSON based on diff options
 */
export function processJsonForDiff(jsonString: string, options: DiffOptions = {}): string {
  try {
    let parsed = JSON.parse(jsonString);

    // Remove ignored keys
    if (options.ignoreKeys && options.ignoreKeys.length > 0) {
      parsed = removeKeys(parsed, options.ignoreKeys);
    }

    // Sort keys alphabetically
    if (options.sortKeys || options.ignoreKeyOrder) {
      parsed = sortJsonKeys(parsed);
    }

    // Sort arrays if needed
    if (options.ignoreArrayOrder) {
      parsed = sortArrays(parsed);
    }

    return JSON.stringify(parsed, null, 2);
  } catch (error) {
    return jsonString;
  }
}

/**
 * Recursively removes specified keys from object
 */
function removeKeys(obj: any, keysToRemove: string[]): any {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => removeKeys(item, keysToRemove));
  }

  const result: any = {};
  Object.keys(obj).forEach((key) => {
    if (!keysToRemove.includes(key)) {
      result[key] = removeKeys(obj[key], keysToRemove);
    }
  });

  return result;
}

/**
 * Recursively sorts arrays (for ignoreArrayOrder option)
 */
function sortArrays(obj: any): any {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    // For primitive arrays, sort directly
    if (obj.length > 0 && typeof obj[0] !== 'object') {
      return [...obj].sort();
    }
    // For object arrays, sort by JSON string representation
    return obj
      .map(sortArrays)
      .sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
  }

  const result: any = {};
  Object.keys(obj).forEach((key) => {
    result[key] = sortArrays(obj[key]);
  });

  return result;
}

/**
 * Counts differences between two JSON objects
 */
export function countDifferences(original: string, modified: string): number {
  try {
    const obj1 = JSON.parse(original);
    const obj2 = JSON.parse(modified);
    return deepDiffCount(obj1, obj2);
  } catch {
    return 0;
  }
}

function deepDiffCount(obj1: any, obj2: any): number {
  let count = 0;

  if (typeof obj1 !== typeof obj2) {
    return 1;
  }

  if (obj1 === null || obj2 === null) {
    return obj1 === obj2 ? 0 : 1;
  }

  if (typeof obj1 !== 'object') {
    return obj1 === obj2 ? 0 : 1;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  const allKeys = new Set([...keys1, ...keys2]);

  allKeys.forEach((key) => {
    if (!(key in obj1) || !(key in obj2)) {
      count++;
    } else {
      count += deepDiffCount(obj1[key], obj2[key]);
    }
  });

  return count;
}

/**
 * Estimates JSON size in KB
 */
export function getJsonSizeKB(jsonString: string): number {
  const bytes = new Blob([jsonString]).size;
  return Math.round((bytes / 1024) * 100) / 100;
}

/**
 * Checks if JSON string is likely too large for browser processing
 */
export function isJsonTooLarge(jsonString: string, maxSizeMB: number = 10): boolean {
  const sizeKB = getJsonSizeKB(jsonString);
  return sizeKB > maxSizeMB * 1024;
}

export interface DetailedDiffStats {
  added: number;
  removed: number;
  modified: number;
  unchanged: number;
  total: number;
}

/**
 * Calculates detailed statistics about differences between two JSON objects
 */
export function calculateDetailedDiffStats(original: string, modified: string): DetailedDiffStats {
  try {
    const obj1 = JSON.parse(original);
    const obj2 = JSON.parse(modified);

    const stats = {
      added: 0,
      removed: 0,
      modified: 0,
      unchanged: 0,
      total: 0
    };

    deepDiffStats(obj1, obj2, stats);

    return stats;
  } catch {
    return {
      added: 0,
      removed: 0,
      modified: 0,
      unchanged: 0,
      total: 0
    };
  }
}

function deepDiffStats(obj1: any, obj2: any, stats: DetailedDiffStats): void {
  // Handle null and undefined
  if (obj1 === null && obj2 === null) {
    stats.unchanged++;
    stats.total++;
    return;
  }

  if (obj1 === null || obj2 === null) {
    if (obj1 === null) {
      stats.added++;
    } else {
      stats.removed++;
    }
    stats.total++;
    return;
  }

  // Handle type mismatch
  if (typeof obj1 !== typeof obj2) {
    stats.modified++;
    stats.total++;
    return;
  }

  // Handle primitives
  if (typeof obj1 !== 'object') {
    if (obj1 === obj2) {
      stats.unchanged++;
    } else {
      stats.modified++;
    }
    stats.total++;
    return;
  }

  // Handle arrays
  if (Array.isArray(obj1) && Array.isArray(obj2)) {
    const maxLength = Math.max(obj1.length, obj2.length);
    for (let i = 0; i < maxLength; i++) {
      if (i >= obj1.length) {
        stats.added++;
        stats.total++;
      } else if (i >= obj2.length) {
        stats.removed++;
        stats.total++;
      } else {
        deepDiffStats(obj1[i], obj2[i], stats);
      }
    }
    return;
  }

  // Handle objects
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  const allKeys = new Set([...keys1, ...keys2]);

  allKeys.forEach((key) => {
    if (!(key in obj1)) {
      stats.added++;
      stats.total++;
    } else if (!(key in obj2)) {
      stats.removed++;
      stats.total++;
    } else {
      deepDiffStats(obj1[key], obj2[key], stats);
    }
  });
}
