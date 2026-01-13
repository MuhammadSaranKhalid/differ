import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';

  const currentDate = new Date().toISOString();

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/differ`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
  ];

  // Tool-specific pages (programmatic SEO pages)
  const toolPages = [
    // JSON Tools
    'json-diff-online',
    'json-compare-online-free',
    'json-diff-ignore-whitespace',
    'json-diff-ignore-key-order',
    'json-formatter-online',
    'json-validator-online',
    'json-schema-validator',
    'json-beautifier-online',
    'json-minifier-online',

    // JSON to X conversions
    'json-to-yaml-converter',
    'json-to-xml-converter',
    'yaml-to-json-converter',
    'xml-to-json-converter',

    // API Tools
    'api-response-diff',
    'api-json-compare',
    'rest-api-diff-tool',
    'compare-api-responses',

    // Developer-specific
    'package-json-compare',
    'compare-config-files',
    'kubernetes-yaml-diff',
    'docker-compose-diff',
    'tsconfig-json-compare',

    // Use case pages
    'compare-large-json-files',
    'json-diff-for-testing',
    'json-merge-tool',
  ].map((slug) => ({
    url: `${baseUrl}/tools/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Guide pages
  const guidePages = [
    'json-comparison-guide',
    'json-schema-validation-guide',
    'yaml-vs-json',
    'api-testing-best-practices',
  ].map((slug) => ({
    url: `${baseUrl}/guides/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...toolPages, ...guidePages];
}
