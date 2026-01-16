import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPageBySlug, getAllPageSlugs } from '@/lib/seo-pages-config';
import { ToolPageClient } from './tool-page-client';
import { BreadcrumbSchema } from '@/components/structured-data';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PageProps {
  params: {
    slug: string;
  };
}

// Generate static params for all SEO pages
export async function generateStaticParams() {
  const slugs = getAllPageSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Generate metadata for each page
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const pageConfig = getPageBySlug(params.slug);

  if (!pageConfig) {
    return {
      title: 'Page Not Found',
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';

  return {
    title: pageConfig.metaTitle,
    description: pageConfig.metaDescription,
    keywords: pageConfig.keywords,
    alternates: {
      canonical: `/tools/${params.slug}`,
    },
    openGraph: {
      title: pageConfig.metaTitle,
      description: pageConfig.metaDescription,
      url: `/tools/${params.slug}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: pageConfig.metaTitle,
      description: pageConfig.metaDescription,
    },
  };
}

export default function ToolPage({ params }: PageProps) {
  const pageConfig = getPageBySlug(params.slug);

  if (!pageConfig) {
    notFound();
  }

  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'Tools', url: '/tools' },
    { name: pageConfig.title, url: `/tools/${params.slug}` },
  ];

  return (
    <>
      {/* Breadcrumb Schema */}
      <BreadcrumbSchema items={breadcrumbItems} />

      <div className="min-h-screen bg-background">
        {/* Header with breadcrumb */}
        <div className="border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Link href="/" className="hover:text-foreground">
                Home
              </Link>
              <span>/</span>
              <Link href="/differ" className="hover:text-foreground">
                Tools
              </Link>
              <span>/</span>
              <span className="text-foreground">{pageConfig.title}</span>
            </div>
            <Link href="/differ">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Main Tool
              </Button>
            </Link>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* SEO Content Header */}
          <div className="max-w-4xl mx-auto mb-8">
            <Badge variant="secondary" className="mb-4">
              {pageConfig.category.replace('-', ' ').toUpperCase()}
            </Badge>
            <h1 className="text-4xl font-bold mb-4">{pageConfig.h1}</h1>
            <p className="text-xl text-muted-foreground mb-6">{pageConfig.description}</p>

            {/* Features List */}
            <Card className="p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Key Features</h2>
              <ul className="space-y-2">
                {pageConfig.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Use Case */}
            <Card className="p-6 mb-8">
              <h2 className="text-xl font-semibold mb-3">Use Case</h2>
              <p className="text-muted-foreground">{pageConfig.useCase}</p>
            </Card>
          </div>

          {/* Tool Interface - Client Component */}
          <ToolPageClient pageConfig={pageConfig} />

          {/* Additional SEO Content */}
          <div className="max-w-4xl mx-auto mt-12">
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-4">About {pageConfig.title}</h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {pageConfig.title} is part of JSON Differ's comprehensive suite of developer tools.
                  Our tool is designed with privacy and performance in mind, processing everything
                  client-side in your browser for maximum security.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Whether you're a backend developer testing APIs, a DevOps engineer managing
                  configurations, or a data analyst validating transformations, {pageConfig.title} provides
                  the professional-grade features you need without any registration or cost.
                </p>

                <h3 className="text-xl font-semibold mt-6 mb-3">Why Choose Our {pageConfig.title}?</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>✓ <strong>100% Free:</strong> No hidden costs, no premium tiers, no limits</li>
                  <li>✓ <strong>Privacy-First:</strong> All processing happens in your browser</li>
                  <li>✓ <strong>No Registration:</strong> Start using immediately without signup</li>
                  <li>✓ <strong>Professional Quality:</strong> Monaco Editor (VS Code engine)</li>
                  <li>✓ <strong>Fast & Reliable:</strong> Optimized for performance</li>
                </ul>

                <h3 className="text-xl font-semibold mt-6 mb-3">How to Use</h3>
                <ol className="space-y-2 text-muted-foreground list-decimal list-inside">
                  <li>Paste your {pageConfig.category.includes('converter') ? 'data' : 'JSON content'} into the editor(s)</li>
                  <li>{pageConfig.presetConfig ? 'Tool is pre-configured with optimal settings for this use case' : 'Customize comparison options if needed'}</li>
                  <li>Click "Show Diff" to see the results</li>
                  <li>Export, download, or share your results</li>
                </ol>

                <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-900 dark:text-blue-100">
                    <strong>💡 Pro Tip:</strong> Use keyboard shortcuts for faster workflow. Press{' '}
                    <kbd className="px-2 py-1 bg-white dark:bg-gray-800 rounded border">?</kbd> to see all
                    available shortcuts.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
