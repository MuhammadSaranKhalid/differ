import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";
import { FileJson, Shield, Zap, Share2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Metadata } from "next";
import {
  SoftwareApplicationSchema,
  WebApplicationSchema,
  FAQSchema,
  HowToSchema,
  OrganizationSchema,
} from "@/components/structured-data";

export const metadata: Metadata = {
  title: "JSON Differ - Free Online JSON Compare & Diff Tool",
  description: "Professional JSON comparison tool trusted by 50,000+ developers. Compare JSON files online, validate JSON schema, convert JSON/YAML/XML formats. 100% free, privacy-first, no login required.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "JSON Differ - Free Online JSON Compare & Diff Tool",
    description: "Professional JSON comparison tool trusted by 50,000+ developers. Compare JSON files online, validate JSON schema, convert JSON/YAML/XML formats.",
    url: "/",
  },
};

export default function Home() {
  return (
    <>
      {/* Structured Data for SEO */}
      <SoftwareApplicationSchema />
      <WebApplicationSchema />
      <FAQSchema />
      <HowToSchema />
      <OrganizationSchema />

      <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center font-semibold">
              <Link href={"/"} className="flex items-center gap-2">
                <FileJson className="h-5 w-5" />
                JSON Differ
              </Link>
            </div>
            {!hasEnvVars ? (
              <EnvVarWarning />
            ) : (
              <Suspense>
                <AuthButton />
              </Suspense>
            )}
          </div>
        </nav>

        {/* Hero Section */}
        <div className="flex-1 w-full flex flex-col items-center justify-center px-5 py-20">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-sm font-medium text-primary mb-4">
              <Shield className="h-4 w-4" />
              100% Privacy-First
            </div>

            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Compare JSON Files
              <br />
              <span className="text-primary">Instantly & Privately</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Professional JSON diff tool with VS Code-powered editor.
              All processing happens in your browser - your data never leaves your device.
            </p>

            <div className="flex items-center justify-center gap-4 pt-4">
              <Link href="/differ">
                <Button size="lg" className="text-lg px-8">
                  Start Comparing
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/differ">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  View Demo
                </Button>
              </Link>
            </div>
          </div>

          {/* Features */}
          <div className="max-w-5xl mx-auto mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Privacy First</h3>
              <p className="text-sm text-muted-foreground">
                Client-side processing only. Your sensitive data stays in your browser and never touches our servers.
              </p>
            </Card>

            <Card className="p-6">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Powerful Editor</h3>
              <p className="text-sm text-muted-foreground">
                VS Code Monaco editor with syntax highlighting, validation, and support for massive files up to 10MB+.
              </p>
            </Card>

            <Card className="p-6">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Share2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Share & Collaborate</h3>
              <p className="text-sm text-muted-foreground">
                Generate shareable links for your diffs. Perfect for code reviews and team collaboration.
              </p>
            </Card>
          </div>

          {/* Advanced Features */}
          <div className="max-w-5xl mx-auto mt-12">
            <h2 className="text-2xl font-bold text-center mb-8">Advanced Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                </div>
                <div>
                  <p className="font-medium">Real-time Validation</p>
                  <p className="text-muted-foreground">Instant syntax error detection with line numbers</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                </div>
                <div>
                  <p className="font-medium">Smart Formatting</p>
                  <p className="text-muted-foreground">Auto-prettify minified JSON with one click</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                </div>
                <div>
                  <p className="font-medium">Ignore Options</p>
                  <p className="text-muted-foreground">Ignore key order, array order, or specific keys</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                </div>
                <div>
                  <p className="font-medium">Export & Download</p>
                  <p className="text-muted-foreground">Copy to clipboard or download as JSON files</p>
                </div>
              </div>
            </div>
          </div>

          {/* SEO Content Section - Visible to search engines and users */}
          <div className="max-w-5xl mx-auto mt-20 space-y-12">
            {/* What is JSON Differ */}
            <section className="prose prose-slate dark:prose-invert max-w-none">
              <h2 className="text-3xl font-bold mb-4">What is JSON Differ?</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                JSON Differ is a powerful, free online tool for comparing JSON files and documents.
                Whether you're debugging API responses, comparing configuration files, or validating data structures,
                our tool provides instant, accurate JSON difference detection with an intuitive visual interface.
                Unlike other JSON comparison tools, we prioritize your privacy by processing everything client-side
                in your browser - your sensitive data never leaves your device.
              </p>
            </section>

            {/* Key Features SEO */}
            <section>
              <h2 className="text-3xl font-bold mb-6">Why Developers Choose JSON Differ</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div>
                  <h3 className="font-semibold text-lg mb-2">🔒 Complete Privacy Protection</h3>
                  <p className="text-muted-foreground">
                    All JSON processing happens directly in your browser using client-side JavaScript.
                    Your API keys, credentials, and sensitive data remain 100% private. No server uploads,
                    no data storage, no tracking. Perfect for comparing production configs and API responses
                    without security concerns.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">⚡ Professional-Grade Editor</h3>
                  <p className="text-muted-foreground">
                    Powered by Monaco Editor (the same engine as VS Code), our JSON diff tool supports
                    syntax highlighting, auto-completion, error detection, and can handle massive JSON files
                    up to 10MB+. Compare large API responses, configuration files, and data exports with ease.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">🎯 Smart JSON Comparison</h3>
                  <p className="text-muted-foreground">
                    Advanced comparison options let you ignore key order, array order, or specific fields
                    (like timestamps and IDs). Perfect for API testing, configuration management, and data
                    validation. Get precise diff results with line-by-line highlighting of additions,
                    deletions, and modifications.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">🔄 Multi-Format Support</h3>
                  <p className="text-muted-foreground">
                    Convert between JSON, YAML, and XML formats instantly. Validate against JSON Schema
                    (Draft 07). Format and beautify minified JSON. Export comparisons as HTML, Markdown,
                    or plain text. All-in-one solution for data transformation and validation.
                  </p>
                </div>
              </div>
            </section>

            {/* Use Cases */}
            <section>
              <h2 className="text-3xl font-bold mb-6">Common Use Cases</h2>
              <div className="space-y-4 text-muted-foreground">
                <div>
                  <h3 className="font-semibold text-primary mb-1">API Testing & Development</h3>
                  <p>Compare API request and response payloads, validate endpoint outputs against expected results,
                  debug REST API changes between versions, and ensure backward compatibility.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-primary mb-1">Configuration Management</h3>
                  <p>Compare package.json files, analyze differences in tsconfig.json settings, validate
                  Kubernetes YAML configurations, diff Docker Compose files, and track config changes across environments.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-primary mb-1">Data Validation & Migration</h3>
                  <p>Verify data transformations, compare database exports, validate ETL pipeline outputs,
                  ensure data integrity during migrations, and diff large JSON datasets.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-primary mb-1">Code Review & Collaboration</h3>
                  <p>Share diff links with team members, review JSON structure changes, validate schema updates,
                  document API changes, and collaborate on configuration updates.</p>
                </div>
              </div>
            </section>

            {/* How to Use */}
            <section>
              <h2 className="text-3xl font-bold mb-6">How to Use JSON Differ</h2>
              <ol className="space-y-3 text-muted-foreground list-decimal list-inside">
                <li>
                  <strong>Paste or Upload:</strong> Copy-paste your JSON content into the left (original) and
                  right (modified) editors, or drag-and-drop JSON files directly into the interface.
                </li>
                <li>
                  <strong>Configure Options:</strong> Click "Options" to customize comparison settings - ignore
                  key order, array order, or specific fields like timestamps. Use presets for common scenarios
                  (API comparison, config files, etc.).
                </li>
                <li>
                  <strong>View Differences:</strong> Click "Show Diff" to see a side-by-side comparison with
                  color-coded highlighting. Green indicates additions, red shows deletions, and yellow highlights
                  modifications.
                </li>
                <li>
                  <strong>Export & Share:</strong> Download results as JSON, export as HTML/Markdown for
                  documentation, or generate a shareable link for team collaboration.
                </li>
              </ol>
            </section>

            {/* FAQ Schema-ready content */}
            <section>
              <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Is JSON Differ really free?</h3>
                  <p className="text-muted-foreground">
                    Yes! JSON Differ is 100% free forever with no limits on file size, number of comparisons,
                    or features. No credit card required, no account needed, no hidden costs.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Is my data secure?</h3>
                  <p className="text-muted-foreground">
                    Absolutely. With Privacy Mode enabled (default), all JSON processing happens client-side
                    in your browser. Your data never leaves your device, never touches our servers, and is
                    never stored or logged. Perfect for sensitive production data.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Can I compare large JSON files?</h3>
                  <p className="text-muted-foreground">
                    Yes! Our tool efficiently handles JSON files up to 10MB+. The Monaco Editor provides
                    virtual scrolling and optimized rendering for large documents without performance degradation.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">What formats are supported?</h3>
                  <p className="text-muted-foreground">
                    JSON Differ supports JSON, YAML, and XML formats. You can compare JSON to JSON, convert
                    between formats (JSON↔YAML↔XML), validate against JSON Schema (Draft 07), and export
                    results in multiple formats.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Can I ignore certain fields in comparison?</h3>
                  <p className="text-muted-foreground">
                    Yes! Use the Options panel to ignore specific keys (like timestamps, IDs, metadata),
                    ignore key order, or ignore array order. We also provide presets for common scenarios
                    like API comparison and config file diffs.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>

        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
          <p>
            Powered by{" "}
            <a
              href="https://supabase.com"
              target="_blank"
              className="font-bold hover:underline"
              rel="noreferrer"
            >
              Supabase
            </a>
          </p>
          <ThemeSwitcher />
        </footer>
      </div>
    </main>
    </>
  );
}
