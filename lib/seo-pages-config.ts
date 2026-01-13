// Configuration for programmatic SEO pages

export interface SEOPageConfig {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  description: string;
  keywords: string[];
  features: string[];
  useCase: string;
  category: 'json-tools' | 'converters' | 'validators' | 'api-tools' | 'config-tools';
  presetConfig?: {
    ignoreKeyOrder?: boolean;
    ignoreArrayOrder?: boolean;
    sortKeys?: boolean;
    ignoreKeys?: string[];
  };
  exampleOriginal?: string;
  exampleModified?: string;
}

export const seoPages: SEOPageConfig[] = [
  // JSON Comparison Tools
  {
    slug: 'json-diff-online',
    title: 'JSON Diff Online',
    metaTitle: 'JSON Diff Online - Free JSON Difference Checker & Compare Tool',
    metaDescription:
      'Compare JSON files online for free. Fast, accurate JSON diff tool with visual highlighting. No login required. Compare JSON strings, objects, and arrays instantly.',
    h1: 'JSON Diff Online - Compare JSON Files Instantly',
    description:
      'Professional JSON diff tool for comparing JSON documents online. Get instant visual feedback with color-coded differences. Perfect for developers debugging API responses, comparing configuration files, or validating data transformations.',
    keywords: [
      'json diff online',
      'json difference',
      'compare json online',
      'json diff checker',
      'json comparison tool',
    ],
    features: [
      'Real-time JSON comparison',
      'Color-coded diff visualization',
      'Support for large JSON files (10MB+)',
      'Privacy-first client-side processing',
      'Export diff as HTML, Markdown, or Text',
    ],
    useCase:
      'Ideal for developers who need to quickly compare two JSON documents and identify differences. Commonly used for API testing, debugging, and data validation.',
    category: 'json-tools',
  },
  {
    slug: 'json-compare-online-free',
    title: 'JSON Compare Online Free',
    metaTitle: 'Free JSON Compare Tool - Compare JSON Files Online No Registration',
    metaDescription:
      '100% free JSON compare tool with no registration or limits. Compare JSON files online, validate differences, and export results. Trusted by 50,000+ developers.',
    h1: 'Free JSON Compare Tool - No Registration Required',
    description:
      'Completely free JSON comparison tool with no hidden costs, registration, or file size limits. Compare JSON data structures, identify differences, and validate changes with our professional-grade editor.',
    keywords: [
      'json compare free',
      'free json comparison',
      'compare json no registration',
      'free json diff tool',
    ],
    features: [
      '100% free forever',
      'No registration or account required',
      'Unlimited file size and comparisons',
      'Professional Monaco Editor',
      'Privacy-first design',
    ],
    useCase:
      'Perfect for developers, QA engineers, and data analysts who need a reliable, free tool for JSON comparison without signup barriers.',
    category: 'json-tools',
  },
  {
    slug: 'json-diff-ignore-whitespace',
    title: 'JSON Diff Ignore Whitespace',
    metaTitle: 'JSON Diff Ignore Whitespace & Formatting - Compare JSON Structure Only',
    metaDescription:
      'Compare JSON files while ignoring whitespace, indentation, and formatting differences. Focus on structural changes only. Free online JSON diff tool.',
    h1: 'JSON Diff - Ignore Whitespace & Formatting',
    description:
      'Smart JSON comparison that ignores whitespace, indentation, and formatting differences. Focus only on actual data changes, not cosmetic formatting. Perfect for comparing minified vs. formatted JSON.',
    keywords: [
      'json diff ignore whitespace',
      'compare json ignore formatting',
      'json structural comparison',
      'ignore json indentation',
    ],
    features: [
      'Ignores whitespace and indentation',
      'Focuses on structural differences only',
      'Compare minified vs formatted JSON',
      'Smart normalization',
      'Real-time validation',
    ],
    useCase:
      'Essential for comparing JSON files that may have different formatting but identical data structure, such as minified production JSON vs. formatted development JSON.',
    category: 'json-tools',
    presetConfig: {
      sortKeys: true,
    },
  },
  {
    slug: 'json-diff-ignore-key-order',
    title: 'JSON Diff Ignore Key Order',
    metaTitle: 'JSON Diff Ignore Key Order - Compare JSON Without Order Sensitivity',
    metaDescription:
      'Compare JSON objects while ignoring property order. Perfect for API testing where key order varies. Free JSON diff tool with key order normalization.',
    h1: 'JSON Diff - Ignore Key Order',
    description:
      'Advanced JSON comparison that ignores property key order. Ideal for comparing API responses where object keys may appear in different orders but contain identical data.',
    keywords: [
      'json diff ignore key order',
      'compare json ignore order',
      'json key order comparison',
      'api json compare',
    ],
    features: [
      'Ignores object key order',
      'Smart key normalization',
      'Perfect for API testing',
      'Flexible comparison options',
      'Export normalized results',
    ],
    useCase:
      'Critical for API testing and validation where different systems may serialize JSON objects with keys in different orders.',
    category: 'api-tools',
    presetConfig: {
      ignoreKeyOrder: true,
      sortKeys: true,
    },
  },

  // Format Converters
  {
    slug: 'json-to-yaml-converter',
    title: 'JSON to YAML Converter',
    metaTitle: 'JSON to YAML Converter Online - Free JSON to YAML Conversion',
    metaDescription:
      'Convert JSON to YAML format instantly. Free online JSON to YAML converter with validation. Perfect for Kubernetes configs, Docker Compose, and CI/CD pipelines.',
    h1: 'JSON to YAML Converter - Fast & Accurate',
    description:
      'Professional JSON to YAML conversion tool. Convert JSON configuration files to YAML format for Kubernetes, Docker Compose, Ansible, and other DevOps tools. Includes validation and formatting.',
    keywords: [
      'json to yaml',
      'json yaml converter',
      'convert json to yaml online',
      'json2yaml',
      'kubernetes json to yaml',
    ],
    features: [
      'Instant JSON to YAML conversion',
      'Syntax validation',
      'Large file support',
      'Download converted files',
      'Copy to clipboard',
    ],
    useCase:
      'Essential for DevOps engineers converting JSON configs to YAML for Kubernetes deployments, Docker Compose files, or CI/CD pipeline configurations.',
    category: 'converters',
  },
  {
    slug: 'yaml-to-json-converter',
    title: 'YAML to JSON Converter',
    metaTitle: 'YAML to JSON Converter Online - Free YAML to JSON Conversion',
    metaDescription:
      'Convert YAML to JSON format online for free. Validate YAML syntax, convert to JSON, and download results. Perfect for API development and data transformation.',
    h1: 'YAML to JSON Converter - Free Online Tool',
    description:
      'Convert YAML files to JSON format with validation. Ideal for converting Kubernetes configs, Docker Compose files, or any YAML data to JSON for APIs and applications.',
    keywords: [
      'yaml to json',
      'yaml json converter',
      'convert yaml to json online',
      'yaml2json',
      'kubernetes yaml to json',
    ],
    features: [
      'YAML to JSON conversion',
      'Real-time validation',
      'Error detection',
      'Format and beautify',
      'Export options',
    ],
    useCase:
      'Perfect for developers converting Kubernetes YAML configs to JSON, or transforming YAML data for JSON-based APIs and applications.',
    category: 'converters',
  },

  // API Tools
  {
    slug: 'api-response-diff',
    title: 'API Response Diff',
    metaTitle: 'API Response Diff Tool - Compare REST API JSON Responses',
    metaDescription:
      'Compare API responses and JSON payloads. Free API diff tool for testing, debugging, and validating REST API changes. Ignore timestamps and IDs.',
    h1: 'API Response Diff Tool - Compare API Outputs',
    description:
      'Specialized tool for comparing API responses. Automatically ignore common metadata fields like timestamps, IDs, and headers. Perfect for API testing, regression testing, and validating API changes.',
    keywords: [
      'api response diff',
      'compare api responses',
      'api json diff',
      'rest api compare',
      'api testing tool',
    ],
    features: [
      'Compare API JSON responses',
      'Auto-ignore timestamps and IDs',
      'Preset for API comparison',
      'Handle nested objects',
      'Perfect for testing',
    ],
    useCase:
      'Essential for backend developers and QA engineers testing API endpoints, comparing responses between versions, or validating API behavior.',
    category: 'api-tools',
    presetConfig: {
      ignoreKeys: ['timestamp', 'id', '_id', 'createdAt', 'updatedAt', 'created_at', 'updated_at'],
    },
    exampleOriginal: JSON.stringify(
      {
        id: 123,
        user: { name: 'John', email: 'john@example.com' },
        timestamp: '2024-01-01T10:00:00Z',
        data: { value: 100 },
      },
      null,
      2
    ),
    exampleModified: JSON.stringify(
      {
        id: 456,
        user: { name: 'John', email: 'john@example.com' },
        timestamp: '2024-01-02T15:30:00Z',
        data: { value: 150 },
      },
      null,
      2
    ),
  },

  // Config Tools
  {
    slug: 'package-json-compare',
    title: 'Package.json Compare',
    metaTitle: 'Package.json Compare Tool - Diff NPM Dependencies & Versions',
    metaDescription:
      'Compare package.json files and npm dependencies. Free tool to diff package versions, scripts, and configurations. Perfect for Node.js projects.',
    h1: 'Package.json Compare - NPM Dependency Diff Tool',
    description:
      'Specialized tool for comparing package.json files. Quickly identify dependency version differences, script changes, and configuration updates across Node.js projects.',
    keywords: [
      'package.json compare',
      'npm dependencies diff',
      'compare package json',
      'node dependencies compare',
      'package version diff',
    ],
    features: [
      'Compare package.json files',
      'Highlight version differences',
      'Compare dependencies',
      'Track script changes',
      'Validate configurations',
    ],
    useCase:
      'Critical for Node.js developers managing dependencies across projects, reviewing version updates, or merging package.json files.',
    category: 'config-tools',
    exampleOriginal: JSON.stringify(
      {
        name: 'my-app',
        version: '1.0.0',
        dependencies: {
          react: '^17.0.0',
          'next': '12.0.0',
        },
        scripts: {
          dev: 'next dev',
          build: 'next build',
        },
      },
      null,
      2
    ),
    exampleModified: JSON.stringify(
      {
        name: 'my-app',
        version: '1.1.0',
        dependencies: {
          react: '^18.2.0',
          next: '13.0.0',
        },
        scripts: {
          dev: 'next dev',
          build: 'next build',
          lint: 'eslint .',
        },
      },
      null,
      2
    ),
  },
  {
    slug: 'kubernetes-yaml-diff',
    title: 'Kubernetes YAML Diff',
    metaTitle: 'Kubernetes YAML Diff Tool - Compare K8s Configs & Manifests',
    metaDescription:
      'Compare Kubernetes YAML configurations and manifests. Free K8s diff tool for deployments, services, and configs. Validate changes before applying.',
    h1: 'Kubernetes YAML Diff - Compare K8s Configurations',
    description:
      'Professional Kubernetes configuration comparison tool. Compare deployments, services, configmaps, and other K8s resources. Validate changes before applying to clusters.',
    keywords: [
      'kubernetes yaml diff',
      'k8s config compare',
      'kubernetes manifest diff',
      'compare k8s yaml',
      'kubernetes deployment diff',
    ],
    features: [
      'Compare Kubernetes YAML',
      'Validate manifests',
      'Highlight config changes',
      'Support all K8s resources',
      'Export diff reports',
    ],
    useCase:
      'Essential for DevOps and platform engineers managing Kubernetes clusters, reviewing manifest changes, or validating configurations before deployment.',
    category: 'config-tools',
  },

  // Validators
  {
    slug: 'json-schema-validator',
    title: 'JSON Schema Validator',
    metaTitle: 'JSON Schema Validator Online - Validate JSON Against Schema (Draft 07)',
    metaDescription:
      'Free JSON Schema validator supporting Draft 07. Validate JSON data against schemas, get detailed error messages, and ensure data integrity.',
    h1: 'JSON Schema Validator - Validate JSON Data',
    description:
      'Professional JSON Schema validation tool supporting JSON Schema Draft 07. Validate JSON documents against schemas, get detailed validation errors, and ensure data integrity.',
    keywords: [
      'json schema validator',
      'validate json schema',
      'json schema validation',
      'json schema checker',
      'validate json online',
    ],
    features: [
      'JSON Schema Draft 07 support',
      'Detailed error messages',
      'Schema templates',
      'Real-time validation',
      'Large file support',
    ],
    useCase:
      'Critical for API developers validating request/response payloads, ensuring data integrity, or testing schema compliance.',
    category: 'validators',
  },

  // Additional high-value pages
  {
    slug: 'json-formatter-online',
    title: 'JSON Formatter Online',
    metaTitle: 'JSON Formatter & Beautifier Online - Format & Pretty Print JSON',
    metaDescription:
      'Free JSON formatter and beautifier. Format minified JSON, validate syntax, and prettify JSON with customizable indentation. Fast and secure.',
    h1: 'JSON Formatter - Beautify & Format JSON Online',
    description:
      'Professional JSON formatting tool. Beautify minified JSON, validate syntax, customize indentation, and format JSON for better readability.',
    keywords: [
      'json formatter',
      'json beautifier',
      'prettify json',
      'format json online',
      'json pretty print',
    ],
    features: [
      'Format minified JSON',
      'Customizable indentation',
      'Syntax validation',
      'Real-time formatting',
      'Copy formatted result',
    ],
    useCase:
      'Perfect for developers working with minified JSON from APIs or production environments who need readable, properly formatted JSON.',
    category: 'json-tools',
  },
  {
    slug: 'compare-large-json-files',
    title: 'Compare Large JSON Files',
    metaTitle: 'Compare Large JSON Files Online - Handle 10MB+ JSON Diffs',
    metaDescription:
      'Compare large JSON files up to 10MB+. Fast, efficient JSON diff tool optimized for large datasets. No file size limits. Free online tool.',
    h1: 'Compare Large JSON Files - 10MB+ Support',
    description:
      'Optimized for comparing large JSON files. Our tool efficiently handles JSON documents over 10MB with virtual scrolling, smart rendering, and optimized diff algorithms.',
    keywords: [
      'compare large json files',
      'large json diff',
      'big json comparison',
      '10mb json diff',
      'large file json compare',
    ],
    features: [
      'Handle 10MB+ JSON files',
      'Virtual scrolling',
      'Optimized rendering',
      'Efficient diff algorithm',
      'No performance degradation',
    ],
    useCase:
      'Ideal for data engineers and developers working with large datasets, database exports, or comprehensive API responses.',
    category: 'json-tools',
  },
];

// Helper function to get page config by slug
export function getPageBySlug(slug: string): SEOPageConfig | undefined {
  return seoPages.find((page) => page.slug === slug);
}

// Helper function to get all slugs
export function getAllPageSlugs(): string[] {
  return seoPages.map((page) => page.slug);
}

// Helper function to get pages by category
export function getPagesByCategory(category: SEOPageConfig['category']): SEOPageConfig[] {
  return seoPages.filter((page) => page.category === category);
}
