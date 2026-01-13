import { NextRequest, NextResponse } from 'next/server';
import { validateAgainstSchema } from '@/lib/schema-validator';

/**
 * POST /api/v1/validate
 * Validate JSON against a JSON Schema
 *
 * Request body:
 * {
 *   "json": { ... },
 *   "schema": { ... }
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "isValid": true,
 *     "errors": []
 *   }
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { json, schema } = body;

    if (!json || !schema) {
      return NextResponse.json(
        {
          success: false,
          error: 'Both "json" and "schema" fields are required',
        },
        { status: 400 }
      );
    }

    // Convert to strings
    const jsonStr = JSON.stringify(json);
    const schemaStr = JSON.stringify(schema);

    // Validate
    const result = validateAgainstSchema(jsonStr, schemaStr);

    return NextResponse.json({
      success: true,
      data: result,
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
