import { NextRequest, NextResponse } from 'next/server';
import { formatJson, minifyJson } from '@/lib/json-utils';

/**
 * POST /api/v1/format
 * Format/prettify or minify JSON
 *
 * Request body:
 * {
 *   "json": { ... },
 *   "tabSize": 2,
 *   "minify": false
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "formatted": "{ ... }"
 *   }
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { json, tabSize = 2, minify = false } = body;

    if (!json) {
      return NextResponse.json(
        {
          success: false,
          error: 'Field "json" is required',
        },
        { status: 400 }
      );
    }

    // Convert to string
    const jsonStr = JSON.stringify(json);

    let formatted: string;

    if (minify) {
      formatted = minifyJson(jsonStr);
    } else {
      formatted = await formatJson(jsonStr, tabSize);
    }

    return NextResponse.json({
      success: true,
      data: {
        formatted,
        size: new Blob([formatted]).size,
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
