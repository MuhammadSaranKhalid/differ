import { Metadata } from 'next';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, BookOpen, Code, Zap, Shield, Globe, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Documentation - JSON Differ Complete Guide',
  description:
    'Complete documentation for JSON Differ. Learn how to compare JSON files, validate schemas, convert formats, and use advanced features. Comprehensive API reference included.',
  alternates: {
    canonical: '/docs',
  },
};

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl">
            <Badge variant="secondary" className="mb-4">
              <BookOpen className="h-3 w-3 mr-1" />
              DOCUMENTATION
            </Badge>
            <h1 className="text-5xl font-bold mb-6">JSON Differ Documentation</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Complete guide to using JSON Differ - the professional JSON comparison, validation, and
              conversion tool trusted by 50,000+ developers worldwide.
            </p>
            <div className="flex gap-4">
              <Link href="/differ">
                <Button size="lg">
                  Try JSON Differ Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/tools">
                <Button size="lg" variant="outline">
                  Browse All Tools
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* What is JSON Differ */}
            <section id="overview">
              <h2 className="text-3xl font-bold mb-4">What is JSON Differ?</h2>
              <Card className="p-6">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  JSON Differ is a comprehensive, free, privacy-first web application for comparing,
                  validating, and converting JSON data. Built with Next.js and powered by the Monaco
                  Editor (the same engine behind VS Code), it provides professional-grade functionality
                  without requiring registration or payment.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  <strong>Key Capabilities:</strong>
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• <strong>JSON Comparison:</strong> Side-by-side diff with advanced options</li>
                  <li>• <strong>Format Conversion:</strong> Convert between JSON, YAML, and XML</li>
                  <li>• <strong>Schema Validation:</strong> Validate JSON against JSON Schema (Draft 07)</li>
                  <li>• <strong>Large File Support:</strong> Handle files up to 10MB+ efficiently</li>
                  <li>• <strong>Privacy-First:</strong> All processing happens client-side in your browser</li>
                </ul>
              </Card>
            </section>

            {/* Quick Start */}
            <section id="quick-start">
              <h2 className="text-3xl font-bold mb-4">Quick Start</h2>
              <Card className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">1. Basic JSON Comparison</h3>
                    <p className="text-muted-foreground mb-3">
                      Navigate to <Link href="/differ" className="text-primary hover:underline">/differ</Link> and:
                    </p>
                    <ol className="list-decimal list-inside space-y-2 text-muted-foreground ml-4">
                      <li>Paste your original JSON in the left editor</li>
                      <li>Paste your modified JSON in the right editor</li>
                      <li>Click "Show Diff" to see highlighted differences</li>
                    </ol>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-2">2. Advanced Comparison Options</h3>
                    <p className="text-muted-foreground mb-3">
                      Click the "Options" button to customize comparison behavior:
                    </p>
                    <ul className="space-y-2 text-muted-foreground ml-4">
                      <li>• <strong>Ignore Key Order:</strong> Treat {"{"}"a":1,"b":2{"}"} as equal to {"{"}"b":2,"a":1{"}"}</li>
                      <li>• <strong>Ignore Array Order:</strong> Treat [1,2,3] as equal to [3,2,1]</li>
                      <li>• <strong>Ignore Specific Keys:</strong> Exclude fields like timestamps, IDs from comparison</li>
                      <li>• <strong>Presets:</strong> Use pre-configured settings for API testing, config files, etc.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-2">3. Format Conversion</h3>
                    <p className="text-muted-foreground mb-3">
                      Switch to the "Convert" tab to transform data between formats:
                    </p>
                    <ul className="space-y-2 text-muted-foreground ml-4">
                      <li>• JSON → YAML (for Kubernetes, Docker Compose)</li>
                      <li>• YAML → JSON (for APIs)</li>
                      <li>• JSON ↔ XML (for legacy systems)</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </section>

            {/* Features */}
            <section id="features">
              <h2 className="text-3xl font-bold mb-4">Core Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-6">
                  <Code className="h-8 w-8 text-primary mb-3" />
                  <h3 className="text-lg font-semibold mb-2">Professional Editor</h3>
                  <p className="text-sm text-muted-foreground">
                    Monaco Editor with syntax highlighting, auto-completion, bracket matching, and
                    real-time validation. Same engine as VS Code.
                  </p>
                </Card>

                <Card className="p-6">
                  <Zap className="h-8 w-8 text-primary mb-3" />
                  <h3 className="text-lg font-semibold mb-2">Lightning Fast</h3>
                  <p className="text-sm text-muted-foreground">
                    Optimized diff algorithm handles 10MB+ files efficiently. Virtual scrolling and
                    lazy loading ensure smooth performance.
                  </p>
                </Card>

                <Card className="p-6">
                  <Shield className="h-8 w-8 text-primary mb-3" />
                  <h3 className="text-lg font-semibold mb-2">Privacy-First</h3>
                  <p className="text-sm text-muted-foreground">
                    All processing happens client-side. Your data never leaves your browser. No
                    tracking, no logging, no server-side storage.
                  </p>
                </Card>

                <Card className="p-6">
                  <Globe className="h-8 w-8 text-primary mb-3" />
                  <h3 className="text-lg font-semibold mb-2">Multi-Format Support</h3>
                  <p className="text-sm text-muted-foreground">
                    Work with JSON, YAML, and XML. Convert between formats seamlessly. Export as
                    HTML, Markdown, or Text.
                  </p>
                </Card>
              </div>
            </section>

            {/* Use Cases */}
            <section id="use-cases">
              <h2 className="text-3xl font-bold mb-4">Common Use Cases</h2>
              <Card className="p-6 space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    API Testing & Development
                  </h3>
                  <p className="text-muted-foreground mb-3">
                    Compare API request/response payloads, validate endpoint outputs, debug REST API
                    changes between versions, and ensure backward compatibility.
                  </p>
                  <p className="text-sm text-muted-foreground italic">
                    "I use JSON Differ daily to compare API responses between staging and production.
                    The 'ignore timestamps' feature saves hours of manual verification." - Backend
                    Developer
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2">Configuration Management</h3>
                  <p className="text-muted-foreground mb-3">
                    Compare package.json files, analyze differences in tsconfig.json settings, validate
                    Kubernetes YAML configurations, diff Docker Compose files.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2">Data Validation & Migration</h3>
                  <p className="text-muted-foreground mb-3">
                    Verify ETL pipeline outputs, compare database exports, validate data
                    transformations, ensure data integrity during migrations.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2">Code Review & Collaboration</h3>
                  <p className="text-muted-foreground mb-3">
                    Share diff links with team members, review JSON structure changes, validate schema
                    updates, document API changes.
                  </p>
                </div>
              </Card>
            </section>

            {/* API Reference */}
            <section id="api">
              <h2 className="text-3xl font-bold mb-4">API Reference</h2>
              <Card className="p-6">
                <p className="text-muted-foreground mb-4">
                  JSON Differ provides a REST API for programmatic access. All endpoints are rate-limited
                  to 100 requests per minute per IP.
                </p>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">POST /api/v1/diff</h3>
                    <p className="text-sm text-muted-foreground mb-2">Compare two JSON objects</p>
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`{
  "original": {"name": "John", "age": 30},
  "modified": {"name": "John", "age": 31}
}`}
                    </pre>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">POST /api/v1/validate</h3>
                    <p className="text-sm text-muted-foreground mb-2">Validate JSON against schema</p>
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`{
  "json": {"name": "John", "age": 30},
  "schema": {
    "type": "object",
    "properties": {
      "name": {"type": "string"},
      "age": {"type": "number"}
    }
  }
}`}
                    </pre>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">POST /api/v1/format</h3>
                    <p className="text-sm text-muted-foreground mb-2">Format/beautify JSON</p>
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`{
  "json": {"name":"John","age":30},
  "tabSize": 2
}`}
                    </pre>
                  </div>
                </div>

                <Link href="/api-docs">
                  <Button className="mt-6">
                    View Full API Documentation
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </Card>
            </section>

            {/* FAQ */}
            <section id="faq">
              <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <Card className="p-6">
                  <h3 className="font-semibold mb-2">Q: Is JSON Differ really free?</h3>
                  <p className="text-muted-foreground">
                    A: Yes, 100% free forever. No hidden costs, no premium tiers, no feature limitations.
                    We believe developer tools should be accessible to everyone.
                  </p>
                </Card>

                <Card className="p-6">
                  <h3 className="font-semibold mb-2">Q: How does privacy mode work?</h3>
                  <p className="text-muted-foreground">
                    A: With Privacy Mode enabled (default), all JSON processing happens locally in your
                    browser using JavaScript. Your data never leaves your device, is never sent to our
                    servers, and is never stored or logged anywhere.
                  </p>
                </Card>

                <Card className="p-6">
                  <h3 className="font-semibold mb-2">Q: What's the maximum file size?</h3>
                  <p className="text-muted-foreground">
                    A: JSON Differ efficiently handles files up to 10MB+. The Monaco Editor uses virtual
                    scrolling and optimized rendering to maintain smooth performance even with large
                    documents.
                  </p>
                </Card>

                <Card className="p-6">
                  <h3 className="font-semibold mb-2">Q: Can I use JSON Differ in my CI/CD pipeline?</h3>
                  <p className="text-muted-foreground">
                    A: Yes! Use our REST API endpoints for automated JSON comparison, validation, and
                    formatting. Rate limited to 100 requests/minute. See the API section above for details.
                  </p>
                </Card>

                <Card className="p-6">
                  <h3 className="font-semibold mb-2">Q: Does JSON Differ work offline?</h3>
                  <p className="text-muted-foreground">
                    A: Once the page is loaded, the core comparison functionality works offline since all
                    processing is client-side. However, features like sharing and API access require an
                    internet connection.
                  </p>
                </Card>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Quick Links</h3>
                <nav className="space-y-2">
                  <a
                    href="#overview"
                    className="block text-sm text-muted-foreground hover:text-foreground"
                  >
                    What is JSON Differ
                  </a>
                  <a
                    href="#quick-start"
                    className="block text-sm text-muted-foreground hover:text-foreground"
                  >
                    Quick Start Guide
                  </a>
                  <a
                    href="#features"
                    className="block text-sm text-muted-foreground hover:text-foreground"
                  >
                    Core Features
                  </a>
                  <a
                    href="#use-cases"
                    className="block text-sm text-muted-foreground hover:text-foreground"
                  >
                    Use Cases
                  </a>
                  <a
                    href="#api"
                    className="block text-sm text-muted-foreground hover:text-foreground"
                  >
                    API Reference
                  </a>
                  <a
                    href="#faq"
                    className="block text-sm text-muted-foreground hover:text-foreground"
                  >
                    FAQ
                  </a>
                </nav>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border-purple-200 dark:border-purple-800">
                <h3 className="font-semibold mb-2">Need Help?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Can't find what you're looking for? Check out our comprehensive guides or reach out
                  for support.
                </p>
                <Link href="/tools">
                  <Button variant="outline" size="sm" className="w-full">
                    Browse All Tools
                  </Button>
                </Link>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
