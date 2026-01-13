// Configuration for developer guides and content hub

export interface GuideConfig {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  author: string;
  publishedDate: string;
  updatedDate: string;
  readingTime: string;
  category: 'tutorial' | 'guide' | 'best-practices' | 'comparison';
  keywords: string[];
  excerpt: string;
  content?: string;
}

export const guides: GuideConfig[] = [
  {
    slug: 'json-comparison-guide',
    title: 'Complete Guide to JSON Comparison',
    metaTitle: 'JSON Comparison Guide 2026 - Best Practices & Techniques',
    metaDescription:
      'Complete guide to JSON comparison and diff. Learn best practices, techniques, and tools for comparing JSON files effectively.',
    author: 'JSON Differ Team',
    publishedDate: '2024-01-15',
    updatedDate: '2025-01-12',
    readingTime: '8 min read',
    category: 'guide',
    keywords: ['json comparison', 'json diff tutorial', 'how to compare json', 'json diff guide'],
    excerpt:
      'Learn everything about comparing JSON files, from basic comparisons to advanced techniques for API testing and data validation.',
    content: `
# JSON Comparison Guide: Everything You Need to Know

JSON (JavaScript Object Notation) has become the de facto standard for data interchange on the web. Whether you're a backend developer testing APIs, a DevOps engineer managing configurations, or a data analyst validating transformations, comparing JSON documents is a critical skill.

## Why Compare JSON?

JSON comparison is essential for:

- **API Testing:** Validate that API responses match expected outputs
- **Configuration Management:** Track changes in config files across environments
- **Data Validation:** Ensure data transformations preserve integrity
- **Debugging:** Identify unexpected changes in JSON structures
- **Code Review:** Understand the impact of JSON structure changes

## Understanding JSON Diff

A JSON diff (difference) operation compares two JSON documents and identifies:
- **Added fields:** Keys that exist in one document but not the other
- **Removed fields:** Keys present in the original but missing in the modified version
- **Modified values:** Fields that exist in both but have different values
- **Unchanged data:** Fields that remain identical

## Best Practices for JSON Comparison

### 1. Handle Key Order Properly

JSON objects are unordered by specification, meaning \`{"a": 1, "b": 2}\` should equal \`{"b": 2, "a": 1}\`. When comparing API responses or configs, enable "ignore key order" to avoid false positives.

### 2. Normalize Timestamps and IDs

API responses often include dynamic fields like timestamps and IDs that change with each request. Use the "ignore keys" feature to exclude these fields from comparison.

### 3. Array Order Matters (Usually)

Unless you're comparing sets, array order typically matters. Only enable "ignore array order" when the order is truly irrelevant to your use case.

### 4. Large File Optimization

For JSON files over 1MB, consider:
- Using the diff view instead of side-by-side
- Disabling real-time validation
- Using the browser's find function to locate specific changes

## Common Use Cases

### API Testing
Compare API responses between versions, environments, or test runs. Ignore timestamps and IDs to focus on actual data changes.

### Configuration Management
Track changes in package.json, tsconfig.json, Kubernetes configs, and other configuration files across versions and environments.

### Data Validation
Verify ETL pipeline outputs, compare database exports, and ensure data integrity during migrations.

### Code Review
Share diff links with team members to review JSON structure changes, schema updates, and configuration modifications.
`,
  },
  {
    slug: 'json-schema-validation-guide',
    title: 'Complete Guide to JSON Schema Validation',
    metaTitle: 'JSON Schema Validation Guide - Complete Tutorial (2026)',
    metaDescription:
      'Complete guide to JSON Schema validation. Learn how to validate JSON data, create schemas, and ensure data integrity in your applications.',
    author: 'JSON Differ Team',
    publishedDate: '2025-01-01',
    updatedDate: '2025-01-12',
    readingTime: '12 min read',
    category: 'tutorial',
    keywords: [
      'json schema',
      'json schema validation',
      'validate json',
      'json schema tutorial',
    ],
    excerpt:
      'Master JSON Schema validation with this comprehensive guide. Learn how to write schemas, validate data, and ensure API consistency.',
    content: `
# Complete Guide to JSON Schema Validation

JSON Schema is a powerful tool for validating the structure and content of JSON data. This guide covers everything you need to know.

## What is JSON Schema?

JSON Schema is a vocabulary that allows you to annotate and validate JSON documents. It provides a contract for what JSON data is required for a given application and how to interact with it.

## Why Use JSON Schema?

- **Data Validation:** Ensure data meets your requirements before processing
- **Documentation:** Self-documenting API contracts
- **Type Safety:** Catch errors early in development
- **IDE Support:** Get autocomplete and validation in modern editors

## Basic Schema Structure

A simple JSON Schema looks like this:

\`\`\`json
{
  "type": "object",
  "properties": {
    "name": { "type": "string" },
    "age": { "type": "number" }
  },
  "required": ["name"]
}
\`\`\`

## Common Schema Keywords

- **type:** Specifies the data type (string, number, object, array, boolean, null)
- **properties:** Defines object properties
- **required:** Array of required property names
- **minimum/maximum:** Numeric constraints
- **minLength/maxLength:** String length constraints
- **pattern:** Regular expression for string validation
- **enum:** Restrict to specific values

## Advanced Features

### Nested Objects
Handle complex nested structures with ease.

### Array Validation
Validate array items and enforce length constraints.

### Conditional Schemas
Apply different validation rules based on data content.

## Best Practices

1. Start simple and add constraints as needed
2. Use descriptive property names
3. Include examples in your schemas
4. Version your schemas
5. Test schemas thoroughly

## Common Use Cases

- API request/response validation
- Configuration file validation
- Form data validation
- Database schema enforcement
`,
  },
  {
    slug: 'api-testing-best-practices',
    title: 'API Testing Best Practices with JSON Diff',
    metaTitle: 'API Testing Best Practices 2026 - Complete Guide',
    metaDescription:
      'Learn API testing best practices using JSON diff tools. Master techniques for comparing API responses, regression testing, and ensuring API consistency.',
    author: 'JSON Differ Team',
    publishedDate: '2025-01-10',
    updatedDate: '2025-01-12',
    readingTime: '10 min read',
    category: 'best-practices',
    keywords: [
      'api testing',
      'rest api testing',
      'api diff',
      'api response comparison',
      'api testing best practices',
    ],
    excerpt:
      'Comprehensive guide to API testing with JSON diff tools. Learn how to compare responses, handle dynamic fields, and implement effective regression testing.',
  },
  {
    slug: 'yaml-vs-json',
    title: 'YAML vs JSON: When to Use Each Format',
    metaTitle: 'YAML vs JSON 2026 - Complete Comparison Guide',
    metaDescription:
      'Comprehensive comparison of YAML and JSON formats. Learn the differences, advantages, use cases, and when to choose YAML or JSON for your projects.',
    author: 'JSON Differ Team',
    publishedDate: '2025-01-05',
    updatedDate: '2025-01-12',
    readingTime: '7 min read',
    category: 'comparison',
    keywords: [
      'yaml vs json',
      'json vs yaml',
      'yaml or json',
      'difference between yaml and json',
      'when to use yaml',
    ],
    excerpt:
      'Understand the key differences between YAML and JSON. Learn which format to choose for configuration files, APIs, and data serialization.',
  },
];

// Helper function to get guide by slug
export function getGuideBySlug(slug: string): GuideConfig | undefined {
  return guides.find((guide) => guide.slug === slug);
}

// Helper function to get all guide slugs
export function getAllGuideSlugs(): string[] {
  return guides.map((guide) => guide.slug);
}

// Helper function to get guides by category
export function getGuidesByCategory(category: GuideConfig['category']): GuideConfig[] {
  return guides.filter((guide) => guide.category === category);
}
