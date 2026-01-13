import yaml from 'js-yaml';
import { XMLParser, XMLBuilder } from 'fast-xml-parser';

export type SupportedFormat = 'json' | 'yaml' | 'xml';

export interface ConversionResult {
  success: boolean;
  data?: string;
  error?: string;
  detectedFormat?: SupportedFormat;
}

/**
 * Detect the format of input string
 */
export function detectFormat(input: string): SupportedFormat {
  const trimmed = input.trim();

  // Check for XML
  if (trimmed.startsWith('<') && trimmed.endsWith('>')) {
    return 'xml';
  }

  // Check for JSON
  if ((trimmed.startsWith('{') && trimmed.endsWith('}')) ||
      (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
    return 'json';
  }

  // Default to YAML
  return 'yaml';
}

/**
 * Convert any supported format to JSON
 */
export function toJSON(input: string, sourceFormat?: SupportedFormat): ConversionResult {
  const format = sourceFormat || detectFormat(input);

  try {
    switch (format) {
      case 'json':
        // Validate JSON
        JSON.parse(input);
        return { success: true, data: input, detectedFormat: 'json' };

      case 'yaml':
        const jsonFromYaml = yaml.load(input);
        return {
          success: true,
          data: JSON.stringify(jsonFromYaml, null, 2),
          detectedFormat: 'yaml',
        };

      case 'xml':
        const parser = new XMLParser({
          ignoreAttributes: false,
          attributeNamePrefix: '@_',
        });
        const jsonFromXml = parser.parse(input);
        return {
          success: true,
          data: JSON.stringify(jsonFromXml, null, 2),
          detectedFormat: 'xml',
        };

      default:
        return {
          success: false,
          error: 'Unsupported format',
        };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Conversion failed',
    };
  }
}

/**
 * Convert JSON to YAML
 */
export function jsonToYAML(jsonString: string): ConversionResult {
  try {
    const obj = JSON.parse(jsonString);
    const yamlStr = yaml.dump(obj, {
      indent: 2,
      lineWidth: 120,
      noRefs: true,
    });

    return {
      success: true,
      data: yamlStr,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Conversion failed',
    };
  }
}

/**
 * Convert JSON to XML
 */
export function jsonToXML(jsonString: string): ConversionResult {
  try {
    const obj = JSON.parse(jsonString);

    const builder = new XMLBuilder({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      format: true,
      indentBy: '  ',
    });

    const xmlStr = builder.build(obj);

    return {
      success: true,
      data: `<?xml version="1.0" encoding="UTF-8"?>\n${xmlStr}`,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Conversion failed',
    };
  }
}

/**
 * Convert YAML to JSON
 */
export function yamlToJSON(yamlString: string): ConversionResult {
  return toJSON(yamlString, 'yaml');
}

/**
 * Convert XML to JSON
 */
export function xmlToJSON(xmlString: string): ConversionResult {
  return toJSON(xmlString, 'xml');
}

/**
 * Convert between any two formats
 */
export function convert(
  input: string,
  from: SupportedFormat,
  to: SupportedFormat
): ConversionResult {
  // If same format, just validate and return
  if (from === to) {
    const jsonResult = toJSON(input, from);
    if (!jsonResult.success) {
      return jsonResult;
    }

    if (to === 'json') {
      return jsonResult;
    }

    // Convert back to original format for validation
    const inputParsed = JSON.parse(jsonResult.data!);
    if (to === 'yaml') {
      return jsonToYAML(JSON.stringify(inputParsed));
    } else {
      return jsonToXML(JSON.stringify(inputParsed));
    }
  }

  // Convert to JSON first
  const jsonResult = toJSON(input, from);
  if (!jsonResult.success) {
    return jsonResult;
  }

  // Then convert to target format
  switch (to) {
    case 'json':
      return jsonResult;
    case 'yaml':
      return jsonToYAML(jsonResult.data!);
    case 'xml':
      return jsonToXML(jsonResult.data!);
    default:
      return {
        success: false,
        error: 'Unsupported target format',
      };
  }
}

/**
 * Get file extension for format
 */
export function getFileExtension(format: SupportedFormat): string {
  return format;
}

/**
 * Get MIME type for format
 */
export function getMimeType(format: SupportedFormat): string {
  switch (format) {
    case 'json':
      return 'application/json';
    case 'yaml':
      return 'text/yaml';
    case 'xml':
      return 'application/xml';
    default:
      return 'text/plain';
  }
}

/**
 * Validate format-specific input
 */
export function validate(input: string, format: SupportedFormat): { isValid: boolean; error?: string } {
  const result = toJSON(input, format);
  return {
    isValid: result.success,
    error: result.error,
  };
}
