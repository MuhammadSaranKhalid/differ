# JSON Differ API Documentation

Version: 1.0.0

Base URL: `https://yourdomain.com/api/v1`

## Overview

The JSON Differ API provides programmatic access to JSON comparison, validation, and formatting features. All endpoints are stateless and require no authentication for basic usage.

**Rate Limit:** 100 requests per minute per IP address

---

## Endpoints

### 1. Compare JSON Objects

Compare two JSON objects and get difference count.

**Endpoint:** `POST /api/v1/diff`

**Request Body:**

```json
{
  "original": {
    "name": "John",
    "age": 30
  },
  "modified": {
    "name": "John",
    "age": 31
  },
  "options": {
    "ignoreKeyOrder": false,
    "ignoreArrayOrder": false,
    "sortKeys": false,
    "ignoreKeys": ["timestamp", "id"]
  }
}
```

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `original` | object | Yes | The original JSON object |
| `modified` | object | Yes | The modified JSON object |
| `options` | object | No | Comparison options |
| `options.ignoreKeyOrder` | boolean | No | Sort keys alphabetically before comparison |
| `options.ignoreArrayOrder` | boolean | No | Sort arrays before comparison |
| `options.sortKeys` | boolean | No | Alphabetically sort all keys |
| `options.ignoreKeys` | string[] | No | Array of keys to ignore in comparison |

**Response (Success):**

```json
{
  "success": true,
  "data": {
    "differenceCount": 1,
    "isValid": true,
    "processedOriginal": {
      "name": "John",
      "age": 30
    },
    "processedModified": {
      "name": "John",
      "age": 31
    },
    "appliedOptions": {
      "ignoreKeys": ["timestamp"]
    }
  }
}
```

**Response (Error):**

```json
{
  "success": false,
  "error": "Invalid original JSON",
  "details": "Unexpected token"
}
```

**Example (cURL):**

```bash
curl -X POST https://yourdomain.com/api/v1/diff \
  -H "Content-Type: application/json" \
  -d '{
    "original": {"name": "John", "age": 30},
    "modified": {"name": "John", "age": 31}
  }'
```

**Example (JavaScript):**

```javascript
const response = await fetch('https://yourdomain.com/api/v1/diff', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    original: { name: 'John', age: 30 },
    modified: { name: 'John', age: 31 },
    options: {
      ignoreKeys: ['timestamp'],
    },
  }),
});

const result = await response.json();
console.log(result.data.differenceCount); // 1
```

**Example (Python):**

```python
import requests

response = requests.post('https://yourdomain.com/api/v1/diff', json={
    'original': {'name': 'John', 'age': 30},
    'modified': {'name': 'John', 'age': 31}
})

result = response.json()
print(result['data']['differenceCount'])  # 1
```

---

### 2. Validate JSON Against Schema

Validate JSON data against a JSON Schema (Draft 07).

**Endpoint:** `POST /api/v1/validate`

**Request Body:**

```json
{
  "json": {
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30
  },
  "schema": {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "properties": {
      "name": { "type": "string" },
      "email": { "type": "string", "format": "email" },
      "age": { "type": "integer", "minimum": 0 }
    },
    "required": ["name", "email"]
  }
}
```

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `json` | object | Yes | JSON object to validate |
| `schema` | object | Yes | JSON Schema (Draft 07) |

**Response (Valid):**

```json
{
  "success": true,
  "data": {
    "isValid": true,
    "errors": []
  }
}
```

**Response (Invalid):**

```json
{
  "success": true,
  "data": {
    "isValid": false,
    "errors": [
      {
        "path": "/email",
        "message": "must match format \"email\"",
        "keyword": "format"
      }
    ]
  }
}
```

**Example (cURL):**

```bash
curl -X POST https://yourdomain.com/api/v1/validate \
  -H "Content-Type: application/json" \
  -d '{
    "json": {"name": "John", "email": "invalid-email"},
    "schema": {
      "type": "object",
      "properties": {
        "email": {"type": "string", "format": "email"}
      }
    }
  }'
```

---

### 3. Format JSON

Format (prettify) or minify JSON.

**Endpoint:** `POST /api/v1/format`

**Request Body:**

```json
{
  "json": {
    "name": "John",
    "age": 30
  },
  "tabSize": 2,
  "minify": false
}
```

**Parameters:**

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `json` | object | Yes | - | JSON object to format |
| `tabSize` | number | No | 2 | Number of spaces for indentation |
| `minify` | boolean | No | false | If true, minify instead of prettify |

**Response:**

```json
{
  "success": true,
  "data": {
    "formatted": "{\n  \"name\": \"John\",\n  \"age\": 30\n}",
    "size": 35
  }
}
```

**Example (cURL - Prettify):**

```bash
curl -X POST https://yourdomain.com/api/v1/format \
  -H "Content-Type": application/json" \
  -d '{
    "json": {"name":"John","age":30},
    "tabSize": 4
  }'
```

**Example (cURL - Minify):**

```bash
curl -X POST https://yourdomain.com/api/v1/format \
  -H "Content-Type: application/json" \
  -d '{
    "json": {"name": "John", "age": 30},
    "minify": true
  }'
```

---

### 4. API Info

Get API information and available endpoints.

**Endpoint:** `GET /api/v1/diff`

**Response:**

```json
{
  "name": "JSON Differ API",
  "version": "1.0.0",
  "endpoints": {
    "POST /api/v1/diff": { ... },
    "POST /api/v1/validate": { ... },
    "POST /api/v1/format": { ... }
  },
  "rateLimit": "100 requests per minute",
  "authentication": "None required for public endpoints"
}
```

---

## Error Handling

All endpoints return errors in a consistent format:

**Error Response Structure:**

```json
{
  "success": false,
  "error": "Error message",
  "details": "Additional error details"
}
```

**Common HTTP Status Codes:**

| Code | Meaning | When It Occurs |
|------|---------|----------------|
| 200 | Success | Request completed successfully |
| 400 | Bad Request | Invalid request body or parameters |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server-side error occurred |

---

## Rate Limiting

**Limits:**
- 100 requests per minute per IP address
- Rate limit headers are included in all responses

**Headers:**

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

**Rate Limit Exceeded Response:**

```json
{
  "success": false,
  "error": "Rate limit exceeded",
  "details": "Try again in 60 seconds"
}
```

---

## Best Practices

### 1. Handle Errors Gracefully

```javascript
try {
  const response = await fetch('/api/v1/diff', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!result.success) {
    console.error('API Error:', result.error);
    return;
  }

  // Use result.data
} catch (error) {
  console.error('Network Error:', error);
}
```

### 2. Validate Input Before Sending

```javascript
function isValidJSON(str) {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}

if (!isValidJSON(userInput)) {
  alert('Invalid JSON');
  return;
}
```

### 3. Use Appropriate Options

```javascript
// For comparing API responses, ignore timestamps
const result = await compareJSON(original, modified, {
  ignoreKeys: ['timestamp', 'updatedAt', 'requestId'],
});

// For comparing unordered data
const result = await compareJSON(original, modified, {
  ignoreArrayOrder: true,
  sortKeys: true,
});
```

---

## Client Libraries

### JavaScript/TypeScript

```typescript
class JSONDifferClient {
  constructor(private baseURL: string = 'https://yourdomain.com/api/v1') {}

  async compare(original: object, modified: object, options = {}) {
    const response = await fetch(`${this.baseURL}/diff`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ original, modified, options }),
    });
    return response.json();
  }

  async validate(json: object, schema: object) {
    const response = await fetch(`${this.baseURL}/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ json, schema }),
    });
    return response.json();
  }

  async format(json: object, tabSize = 2, minify = false) {
    const response = await fetch(`${this.baseURL}/format`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ json, tabSize, minify }),
    });
    return response.json();
  }
}

// Usage
const client = new JSONDifferClient();
const result = await client.compare(obj1, obj2);
```

### Python

```python
import requests

class JSONDifferClient:
    def __init__(self, base_url='https://yourdomain.com/api/v1'):
        self.base_url = base_url

    def compare(self, original, modified, options=None):
        response = requests.post(
            f'{self.base_url}/diff',
            json={'original': original, 'modified': modified, 'options': options or {}}
        )
        return response.json()

    def validate(self, json_data, schema):
        response = requests.post(
            f'{self.base_url}/validate',
            json={'json': json_data, 'schema': schema}
        )
        return response.json()

    def format_json(self, json_data, tab_size=2, minify=False):
        response = requests.post(
            f'{self.base_url}/format',
            json={'json': json_data, 'tabSize': tab_size, 'minify': minify}
        )
        return response.json()

# Usage
client = JSONDifferClient()
result = client.compare({'a': 1}, {'a': 2})
print(result['data']['differenceCount'])
```

---

## Use Cases

### 1. API Testing

```javascript
const expected = await fetch('/api/users/1').then((r) => r.json());
const actual = await fetch('/api/users/1').then((r) => r.json());

const diff = await client.compare(expected, actual, {
  ignoreKeys: ['timestamp', 'requestId'],
});

if (diff.data.differenceCount > 0) {
  console.error('API response changed!');
}
```

### 2. Configuration Validation

```javascript
const config = require('./config.json');
const schema = require('./config.schema.json');

const validation = await client.validate(config, schema);

if (!validation.data.isValid) {
  console.error('Invalid configuration:', validation.data.errors);
  process.exit(1);
}
```

### 3. Data Migration

```javascript
const oldData = await db.collection('users').find().toArray();
const newData = await newDb.collection('users').find().toArray();

const diff = await client.compare(oldData, newData, {
  ignoreKeys: ['_id', 'migratedAt'],
});

console.log(`${diff.data.differenceCount} records differ`);
```

---

## Support

- **Documentation:** https://yourdomain.com/docs
- **GitHub:** https://github.com/yourorg/json-differ
- **Issues:** https://github.com/yourorg/json-differ/issues

---

**Last Updated:** 2025-01-01
