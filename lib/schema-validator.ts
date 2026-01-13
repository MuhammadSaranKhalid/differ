import Ajv, { ValidateFunction, ErrorObject } from 'ajv';
import addFormats from 'ajv-formats';
import { validateJsonSchema as sanitizeSchema } from './sanitize';

const ajv = new Ajv({ allErrors: true, verbose: true });
addFormats(ajv);

export interface SchemaValidationResult {
  isValid: boolean;
  errors?: {
    path: string;
    message: string;
    keyword: string;
  }[];
}

/**
 * Validate JSON against a JSON Schema
 */
export function validateAgainstSchema(
  jsonString: string,
  schemaString: string
): SchemaValidationResult {
  try {
    const data = JSON.parse(jsonString);
    const schema = JSON.parse(schemaString);

    // Validate schema for dangerous patterns (ReDoS protection)
    if (!sanitizeSchema(schema)) {
      return {
        isValid: false,
        errors: [{
          path: '/',
          message: 'Schema contains potentially dangerous regex patterns',
          keyword: 'security',
        }],
      };
    }

    const validate: ValidateFunction = ajv.compile(schema);
    const isValid = validate(data);

    if (!isValid && validate.errors) {
      return {
        isValid: false,
        errors: validate.errors.map((error: ErrorObject) => ({
          path: error.instancePath || '/',
          message: error.message || 'Validation error',
          keyword: error.keyword,
        })),
      };
    }

    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      errors: [
        {
          path: '/',
          message: error instanceof Error ? error.message : 'Invalid JSON or Schema',
          keyword: 'parse',
        },
      ],
    };
  }
}

/**
 * Generate a basic JSON Schema from a JSON object
 */
export function generateSchemaFromJson(jsonString: string): string {
  try {
    const obj = JSON.parse(jsonString);
    const schema = generateSchemaFromObject(obj);
    return JSON.stringify(schema, null, 2);
  } catch (error) {
    throw new Error('Cannot generate schema from invalid JSON');
  }
}

function generateSchemaFromObject(obj: any): any {
  if (obj === null) {
    return { type: 'null' };
  }

  if (Array.isArray(obj)) {
    if (obj.length === 0) {
      return { type: 'array', items: {} };
    }
    return {
      type: 'array',
      items: generateSchemaFromObject(obj[0]),
    };
  }

  if (typeof obj === 'object') {
    const properties: any = {};
    const required: string[] = [];

    Object.keys(obj).forEach((key) => {
      properties[key] = generateSchemaFromObject(obj[key]);
      required.push(key);
    });

    return {
      type: 'object',
      properties,
      required,
    };
  }

  // Primitive types
  const type = typeof obj;
  if (type === 'number') {
    return Number.isInteger(obj) ? { type: 'integer' } : { type: 'number' };
  }

  return { type };
}

/**
 * Common JSON Schema templates
 */
export const SCHEMA_TEMPLATES = {
  basic: {
    $schema: 'http://json-schema.org/draft-07/schema#',
    type: 'object',
    properties: {},
    required: [],
  },

  api_response: {
    $schema: 'http://json-schema.org/draft-07/schema#',
    type: 'object',
    properties: {
      status: { type: 'string', enum: ['success', 'error'] },
      data: { type: 'object' },
      message: { type: 'string' },
      timestamp: { type: 'string', format: 'date-time' },
    },
    required: ['status'],
  },

  user: {
    $schema: 'http://json-schema.org/draft-07/schema#',
    type: 'object',
    properties: {
      id: { type: 'integer' },
      name: { type: 'string', minLength: 1 },
      email: { type: 'string', format: 'email' },
      age: { type: 'integer', minimum: 0 },
      createdAt: { type: 'string', format: 'date-time' },
    },
    required: ['id', 'name', 'email'],
  },

  config: {
    $schema: 'http://json-schema.org/draft-07/schema#',
    type: 'object',
    properties: {
      version: { type: 'string' },
      settings: {
        type: 'object',
        additionalProperties: true,
      },
      features: {
        type: 'object',
        patternProperties: {
          '.*': { type: 'boolean' },
        },
      },
    },
    required: ['version'],
  },
};

/**
 * Get formatted schema template by name
 */
export function getSchemaTemplate(name: keyof typeof SCHEMA_TEMPLATES): string {
  return JSON.stringify(SCHEMA_TEMPLATES[name], null, 2);
}
