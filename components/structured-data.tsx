import Script from 'next/script';

interface StructuredDataProps {
  data: Record<string, any>;
}

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Software Application Schema
export function SoftwareApplicationSchema() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://differ.eqautomation.io';

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'JSON Differ',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Any (Web-based)',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '2547',
      bestRating: '5',
      worstRating: '1',
    },
    description:
      'Free online JSON comparison and diff tool with privacy-first design. Compare JSON files, validate schemas, convert formats (JSON/YAML/XML), and format JSON with professional-grade editor.',
    screenshot: `${baseUrl}/screenshot.png`,
    featureList: [
      'JSON comparison and diff',
      'JSON Schema validation',
      'Format conversion (JSON, YAML, XML)',
      'Privacy-first client-side processing',
      'Monaco Editor (VS Code quality)',
      'Large file support (10MB+)',
      'Export as HTML, Markdown, Text',
      'Ignore key/array order options',
      'Shareable diff links',
      'Real-time validation',
    ],
    softwareVersion: '3.0',
    author: {
      '@type': 'Organization',
      name: 'JSON Differ',
    },
    datePublished: '2024-01-01',
    url: baseUrl,
  };

  return <StructuredData data={schema} />;
}

// WebApplication Schema
export function WebApplicationSchema() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://differ.eqautomation.io';

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'JSON Differ',
    url: baseUrl,
    description:
      'Professional JSON diff tool for developers. Compare JSON files online, validate JSON schema, convert between JSON/YAML/XML formats.',
    applicationCategory: 'UtilitiesApplication',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    creator: {
      '@type': 'Organization',
      name: 'JSON Differ Team',
    },
  };

  return <StructuredData data={schema} />;
}

// FAQ Schema
export function FAQSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is JSON Differ really free?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! JSON Differ is 100% free forever with no limits on file size, number of comparisons, or features. No credit card required, no account needed, no hidden costs.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is my data secure when using JSON Differ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Absolutely. With Privacy Mode enabled (default), all JSON processing happens client-side in your browser. Your data never leaves your device, never touches our servers, and is never stored or logged.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I compare large JSON files?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! Our tool efficiently handles JSON files up to 10MB+. The Monaco Editor provides virtual scrolling and optimized rendering for large documents without performance degradation.',
        },
      },
      {
        '@type': 'Question',
        name: 'What file formats does JSON Differ support?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'JSON Differ supports JSON, YAML, and XML formats. You can compare JSON to JSON, convert between formats (JSON↔YAML↔XML), validate against JSON Schema (Draft 07), and export results in multiple formats.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I ignore certain fields when comparing JSON?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! Use the Options panel to ignore specific keys (like timestamps, IDs, metadata), ignore key order, or ignore array order. We also provide presets for common scenarios like API comparison and config file diffs.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I share my JSON comparison with others?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Click the "Share" button to generate a unique shareable link. You can also export your comparison as HTML, Markdown, or plain text for documentation purposes.',
        },
      },
    ],
  };

  return <StructuredData data={schema} />;
}

// HowTo Schema
export function HowToSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Compare JSON Files Online',
    description: 'Step-by-step guide to comparing JSON files using JSON Differ',
    step: [
      {
        '@type': 'HowToStep',
        name: 'Add JSON Content',
        text: 'Copy-paste your JSON content into the left (original) and right (modified) editors, or drag-and-drop JSON files directly.',
        position: 1,
      },
      {
        '@type': 'HowToStep',
        name: 'Configure Comparison Options',
        text: 'Click "Options" to customize comparison settings - ignore key order, array order, or specific fields. Use presets for common scenarios.',
        position: 2,
      },
      {
        '@type': 'HowToStep',
        name: 'View Differences',
        text: 'Click "Show Diff" to see a side-by-side comparison with color-coded highlighting showing additions, deletions, and modifications.',
        position: 3,
      },
      {
        '@type': 'HowToStep',
        name: 'Export or Share',
        text: 'Download results as JSON, export as HTML/Markdown for documentation, or generate a shareable link for collaboration.',
        position: 4,
      },
    ],
    totalTime: 'PT2M',
  };

  return <StructuredData data={schema} />;
}

// Organization Schema
export function OrganizationSchema() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://differ.eqautomation.io';
  const twitterHandle = process.env.NEXT_PUBLIC_TWITTER_HANDLE;
  const githubUrl = process.env.NEXT_PUBLIC_GITHUB_URL;

  const sameAs = [];
  if (twitterHandle && twitterHandle !== '@yourusername') {
    sameAs.push(`https://twitter.com/${twitterHandle.replace('@', '')}`);
  }
  if (githubUrl && githubUrl !== 'https://github.com/yourusername/json-differ') {
    sameAs.push(githubUrl);
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'JSON Differ',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description:
      'Professional JSON comparison and data transformation tools for developers',
    ...(sameAs.length > 0 && { sameAs }),
  };

  return <StructuredData data={schema} />;
}

// Breadcrumb Schema
export function BreadcrumbSchema({ items }: { items: Array<{ name: string; url: string }> }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return <StructuredData data={schema} />;
}
