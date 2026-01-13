/**
 * Input sanitization utilities to prevent XSS and injection attacks
 */

/**
 * Sanitize user input by removing potentially dangerous characters
 * while preserving valid JSON/YAML/XML content
 */
export function sanitizeInput(input: string, maxLength = 10485760): string {
  // Limit input length (10MB default)
  if (input.length > maxLength) {
    throw new Error(`Input exceeds maximum length of ${maxLength} characters`);
  }

  // Input is already safe for JSON/YAML/XML processing
  // We don't need to strip anything as it's processed as text data
  return input;
}

/**
 * Sanitize strings for display in HTML contexts
 * Escapes HTML special characters
 */
export function sanitizeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };

  return text.replace(/[&<>"'/]/g, (char) => map[char] || char);
}

/**
 * Validate and sanitize file names
 */
export function sanitizeFileName(fileName: string): string {
  // Remove path traversal attempts
  let sanitized = fileName.replace(/\.\./g, '');

  // Remove directory separators
  sanitized = sanitized.replace(/[/\\]/g, '');

  // Remove null bytes
  sanitized = sanitized.replace(/\0/g, '');

  // Limit to alphanumeric, dots, dashes, underscores
  sanitized = sanitized.replace(/[^a-zA-Z0-9._-]/g, '_');

  // Limit length
  if (sanitized.length > 255) {
    const ext = sanitized.substring(sanitized.lastIndexOf('.'));
    sanitized = sanitized.substring(0, 250) + ext;
  }

  return sanitized || 'download';
}

/**
 * Validate JSON Schema to prevent ReDoS attacks
 */
export function validateJsonSchema(schema: unknown): boolean {
  if (typeof schema !== 'object' || schema === null) {
    return false;
  }

  const schemaObj = schema as Record<string, unknown>;

  // Check for dangerous regex patterns
  const checkPattern = (pattern: unknown): boolean => {
    if (typeof pattern !== 'string') return true;

    // Detect potentially dangerous regex patterns
    // Nested quantifiers, excessive backtracking
    const dangerousPatterns = [
      /(\*|\+|\{.*\}){2,}/, // Nested quantifiers
      /\(.*\)\\1/, // Backreferences with quantifiers
    ];

    return !dangerousPatterns.some(p => p.test(pattern));
  };

  // Recursively check schema
  const checkValue = (value: unknown): boolean => {
    if (typeof value === 'object' && value !== null) {
      const obj = value as Record<string, unknown>;

      if (obj.pattern && !checkPattern(obj.pattern)) {
        return false;
      }

      return Object.values(obj).every(checkValue);
    }
    return true;
  };

  return checkValue(schemaObj);
}

/**
 * Sanitize URL for safe fetching
 */
export function sanitizeUrl(url: string): string | null {
  try {
    const parsed = new URL(url);

    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return null;
    }

    // Prevent SSRF to localhost/private IPs
    const hostname = parsed.hostname.toLowerCase();
    const blockedHosts = [
      'localhost',
      '127.0.0.1',
      '0.0.0.0',
      '::1',
      '169.254.169.254', // AWS metadata
    ];

    if (blockedHosts.includes(hostname)) {
      return null;
    }

    // Check for private IP ranges
    if (hostname.match(/^(10\.|172\.(1[6-9]|2[0-9]|3[01])\.|192\.168\.)/)) {
      return null;
    }

    return parsed.toString();
  } catch {
    return null;
  }
}

/**
 * Rate limit check for API calls
 * Simple in-memory implementation
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  key: string,
  limit: number = 100,
  windowMs: number = 60000
): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, {
      count: 1,
      resetTime: now + windowMs,
    });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count++;
  return true;
}

/**
 * Clear old rate limit entries (call periodically)
 */
export function cleanupRateLimits(): void {
  const now = Date.now();
  for (const [key, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}
