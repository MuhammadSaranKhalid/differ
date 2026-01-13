import { Metadata } from 'next';
import Link from 'next/link';
import { seoPages, getPagesByCategory } from '@/lib/seo-pages-config';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, FileJson, RefreshCw, CheckCircle2, Code, Settings } from 'lucide-react';

export const metadata: Metadata = {
  title: 'JSON Tools - Free Online JSON Diff, Compare, Convert & Validate',
  description:
    'Comprehensive suite of free JSON tools including JSON diff, comparison, validation, format conversion (JSON/YAML/XML), and more. No registration required.',
  alternates: {
    canonical: '/tools',
  },
};

export default function ToolsPage() {
  const jsonTools = getPagesByCategory('json-tools');
  const converters = getPagesByCategory('converters');
  const validators = getPagesByCategory('validators');
  const apiTools = getPagesByCategory('api-tools');
  const configTools = getPagesByCategory('config-tools');

  const categoryIcons: Record<string, any> = {
    'json-tools': FileJson,
    'converters': RefreshCw,
    'validators': CheckCircle2,
    'api-tools': Code,
    'config-tools': Settings,
  };

  const categoryDescriptions: Record<string, string> = {
    'json-tools': 'Essential JSON manipulation and comparison tools',
    'converters': 'Convert between JSON, YAML, and XML formats',
    'validators': 'Validate JSON against schemas and check syntax',
    'api-tools': 'Tools specialized for API development and testing',
    'config-tools': 'Compare and manage configuration files',
  };

  const renderCategory = (
    categoryName: string,
    categorySlug: string,
    tools: typeof jsonTools
  ) => {
    const Icon = categoryIcons[categorySlug];
    return (
      <section key={categorySlug} className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{categoryName}</h2>
            <p className="text-sm text-muted-foreground">{categoryDescriptions[categorySlug]}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <Link key={tool.slug} href={`/tools/${tool.slug}`}>
              <Card className="p-6 h-full hover:shadow-lg transition-shadow cursor-pointer group">
                <div className="flex flex-col h-full">
                  <div className="mb-3">
                    <Badge variant="secondary" className="mb-2">
                      {tool.category.replace('-', ' ')}
                    </Badge>
                    <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                      {tool.title}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 flex-grow">
                    {tool.metaDescription.slice(0, 120)}...
                  </p>
                  <div className="flex items-center text-sm text-primary font-medium">
                    Try it now
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl">
            <Badge variant="secondary" className="mb-4">
              FREE TOOLS
            </Badge>
            <h1 className="text-4xl font-bold mb-4">JSON Developer Tools</h1>
            <p className="text-xl text-muted-foreground mb-6">
              Professional suite of free JSON tools for developers. Compare, convert, validate, and
              manipulate JSON data with ease. All tools are privacy-first and require no
              registration.
            </p>
            <Link href="/differ">
              <Button size="lg">
                Access Full Tool Suite
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="container mx-auto px-4 py-12">
        {jsonTools.length > 0 &&
          renderCategory('JSON Comparison Tools', 'json-tools', jsonTools)}
        {apiTools.length > 0 && renderCategory('API Testing Tools', 'api-tools', apiTools)}
        {converters.length > 0 &&
          renderCategory('Format Converters', 'converters', converters)}
        {validators.length > 0 && renderCategory('Validators', 'validators', validators)}
        {configTools.length > 0 &&
          renderCategory('Configuration Tools', 'config-tools', configTools)}

        {/* CTA Section */}
        <Card className="p-8 mt-12 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border-purple-200 dark:border-purple-800">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Need All Features in One Place?</h2>
            <p className="text-muted-foreground mb-6">
              Access our complete JSON Differ platform with advanced comparison options, format
              conversion, schema validation, history management, and more.
            </p>
            <Link href="/differ">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                Go to Full JSON Differ Tool
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </Card>

        {/* SEO Content */}
        <div className="mt-12 prose prose-slate dark:prose-invert max-w-none">
          <h2 className="text-2xl font-bold mb-4">About Our JSON Tools</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Our comprehensive suite of JSON tools is designed specifically for developers, QA
            engineers, and data analysts. Each tool is optimized for a specific use case while
            maintaining the same high standards of performance, privacy, and usability.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            All tools process data client-side in your browser, ensuring your sensitive information
            never leaves your device. No registration, no tracking, no data storage - just powerful,
            professional-grade tools that work instantly.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Why Choose Our Tools?</h3>
          <ul className="space-y-2 text-muted-foreground">
            <li>✓ <strong>100% Free Forever:</strong> No hidden costs or premium features</li>
            <li>✓ <strong>Privacy-First Design:</strong> All processing happens in your browser</li>
            <li>✓ <strong>No Registration Required:</strong> Start using immediately</li>
            <li>✓ <strong>Professional Quality:</strong> Powered by Monaco Editor (VS Code)</li>
            <li>✓ <strong>Large File Support:</strong> Handle files up to 10MB+</li>
            <li>✓ <strong>Export Options:</strong> Download or share your results</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
