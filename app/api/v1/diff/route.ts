import { NextRequest, NextResponse } from 'next/server';
import { validateJson, countDifferences, processJsonForDiff } from '@/lib/json-utils';

/**
 * POST /api/v1/diff
 * Compare two JSON objects programmatically
 *
 * Request body:
 * {
 *   "original": { ... },
 *   "modified": { ... },
 *   "options": {
 *     "ignoreKeyOrder": false,
 *     "ignoreArrayOrder": false,
 *     "ignoreKeys": ["timestamp", "id"]
 *   }
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "differenceCount": 5,
 *     "isValid": true,
 *     "processedOriginal": { ... },
 *     "processedModified": { ... }
 *   }
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { original, modified, options = {} } = body;

    if (!original || !modified) {
      return NextResponse.json(
        {
          success: false,
          error: 'Both "original" and "modified" fields are required',
        },
        { status: 400 }
      );
    }

    // Convert to strings for validation
    const originalStr = JSON.stringify(original);
    const modifiedStr = JSON.stringify(modified);

    // Validate both JSONs
    const originalValidation = validateJson(originalStr);
    const modifiedValidation = validateJson(modifiedStr);

    if (!originalValidation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid original JSON',
          details: originalValidation.error,
        },
        { status: 400 }
      );
    }

    if (!modifiedValidation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid modified JSON',
          details: modifiedValidation.error,
        },
        { status: 400 }
      );
    }

    // Process with options if provided
    let processedOriginal = originalStr;
    let processedModified = modifiedStr;

    if (options && Object.keys(options).length > 0) {
      processedOriginal = processJsonForDiff(originalStr, options);
      processedModified = processJsonForDiff(modifiedStr, options);
    }

    // Count differences
    const differenceCount = countDifferences(processedOriginal, processedModified);

    return NextResponse.json({
      success: true,
      data: {
        differenceCount,
        isValid: true,
        processedOriginal: JSON.parse(processedOriginal),
        processedModified: JSON.parse(processedModified),
        appliedOptions: options,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/v1/diff
 * API documentation
 */
export async function GET() {
  return NextResponse.json({
    name: 'JSON Differ API',
    version: '1.0.0',
    endpoints: {
      'POST /api/v1/diff': {
        description: 'Compare two JSON objects',
        body: {
          original: 'object (required) - The original JSON',
          modified: 'object (required) - The modified JSON',
          options: {
            ignoreKeyOrder: 'boolean - Sort keys alphabetically',
            ignoreArrayOrder: 'boolean - Sort arrays before comparison',
            sortKeys: 'boolean - Alphabetically sort all keys',
            ignoreKeys: 'string[] - Keys to ignore in comparison',
          },
        },
        response: {
          success: 'boolean',
          data: {
            differenceCount: 'number',
            isValid: 'boolean',
            processedOriginal: 'object',
            processedModified: 'object',
          },
        },
      },
      'POST /api/v1/validate': {
        description: 'Validate JSON against a schema',
        body: {
          json: 'object (required) - JSON to validate',
          schema: 'object (required) - JSON Schema (Draft 07)',
        },
      },
      'POST /api/v1/format': {
        description: 'Format/prettify JSON',
        body: {
          json: 'object (required) - JSON to format',
          tabSize: 'number - Indentation size (default: 2)',
        },
      },
    },
    rateLimit: '100 requests per minute',
    authentication: 'None required for public endpoints',
  });
}
