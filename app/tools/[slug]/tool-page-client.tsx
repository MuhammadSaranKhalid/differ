'use client';

import { useState, useEffect } from 'react';
import { SEOPageConfig } from '@/lib/seo-pages-config';
import dynamic from 'next/dynamic';
import { EditorLoading } from '@/components/editor-loading';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

const JsonDiffEditor = dynamic(
  () => import('@/components/json-diff-editor').then((mod) => ({ default: mod.JsonDiffEditor })),
  {
    ssr: false,
    loading: () => <EditorLoading height="600px" showDualEditor={true} />,
  }
);

interface ToolPageClientProps {
  pageConfig: SEOPageConfig;
}

export function ToolPageClient({ pageConfig }: ToolPageClientProps) {
  const [original, setOriginal] = useState('');
  const [modified, setModified] = useState('');
  const [showDiff, setShowDiff] = useState(false);

  // Set example data if available
  useEffect(() => {
    if (pageConfig.exampleOriginal) {
      setOriginal(pageConfig.exampleOriginal);
    }
    if (pageConfig.exampleModified) {
      setModified(pageConfig.exampleModified);
    }
  }, [pageConfig]);

  const hasExamples = pageConfig.exampleOriginal && pageConfig.exampleModified;

  return (
    <div className="space-y-6">
      {/* CTA for examples */}
      {hasExamples && (
        <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-purple-600" />
              <div>
                <h3 className="font-semibold">Pre-loaded with Example Data</h3>
                <p className="text-sm text-muted-foreground">
                  Try it now with realistic {pageConfig.title.toLowerCase()} examples
                </p>
              </div>
            </div>
            <Button
              onClick={() => setShowDiff(true)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Show Example Diff
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}

      {/* Tool Interface */}
      <JsonDiffEditor
        original={original}
        modified={modified}
        onOriginalChange={setOriginal}
        onModifiedChange={setModified}
        showDiff={showDiff}
        height="600px"
      />

      {/* Action Buttons */}
      <div className="flex items-center justify-between gap-4">
        <Button
          onClick={() => setShowDiff(!showDiff)}
          variant={showDiff ? 'default' : 'outline'}
          size="lg"
        >
          {showDiff ? 'Show Editors' : 'Show Diff'}
        </Button>

        <Link href="/differ">
          <Button variant="outline" size="lg">
            Access Full Tool
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Info Card */}
      <Card className="p-6 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold mb-1">Need More Features?</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Visit our full JSON Differ tool for advanced features like format conversion, schema
              validation, history management, and more.
            </p>
            <Link href="/differ">
              <Button size="sm" variant="outline">
                Go to Full Tool →
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}

function CheckCircle2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
