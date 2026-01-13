import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { VantaBackground } from "@/components/vanta-background";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";
import { FileJson, Shield, Zap, Share2, ArrowRight, Code2, CheckCircle2 } from "lucide-react";
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
        {/* Enhanced Navigation */}
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16 sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="w-full max-w-7xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center font-semibold">
              <Link href={"/"} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                  <FileJson className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-lg font-bold">JSON Differ</span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <ThemeSwitcher />
              {!hasEnvVars ? (
                <EnvVarWarning />
              ) : (
                <Suspense>
                  <AuthButton />
                </Suspense>
              )}
            </div>
          </div>
        </nav>

        {/* Hero Section with 3D Animated Background */}
        <div className="relative w-full flex flex-col items-center justify-center px-5 py-24 md:py-32 overflow-hidden">
          {/* 3D Vanta.js background */}
          <VantaBackground />

          {/* Gradient overlay */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-background/90 via-background/80 to-background/90" />

          <div className="max-w-5xl mx-auto text-center space-y-8 relative">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium text-primary mb-4 hover:scale-105 transition-transform">
              <Shield className="h-4 w-4" />
              <span>100% Privacy-First • Client-Side Processing</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              Compare JSON Files
              <br />
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Instantly & Privately
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Professional JSON diff tool with VS Code-powered editor.
              <br className="hidden md:block" />
              All processing happens in your browser - your data never leaves your device.
            </p>

            <div className="flex items-center justify-center pt-6">
              <Link href="/differ">
                <Button size="lg" className="shadow-lg hover:shadow-xl transition-shadow">
                  Start Comparing
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-8 pt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>50,000+ Developers</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>100% Free Forever</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>No Login Required</span>
              </div>
            </div>
          </div>

        </div>

        {/* Features Section */}
        <div className="w-full bg-muted/30 py-20">
          <div className="max-w-7xl mx-auto px-5">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose JSON Differ?</h2>
              <p className="text-muted-foreground text-lg">Everything you need for professional JSON comparison</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/50 group">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Shield className="h-7 w-7 text-primary-foreground" />
                </div>
                <h3 className="font-bold text-xl mb-3">Privacy First</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Client-side processing only. Your sensitive data stays in your browser and never touches our servers.
                </p>
              </Card>

              <Card className="p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/50 group">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Zap className="h-7 w-7 text-primary-foreground" />
                </div>
                <h3 className="font-bold text-xl mb-3">Powerful Editor</h3>
                <p className="text-muted-foreground leading-relaxed">
                  VS Code Monaco editor with syntax highlighting, validation, and support for massive files up to 10MB+.
                </p>
              </Card>

              <Card className="p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/50 group">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Share2 className="h-7 w-7 text-primary-foreground" />
                </div>
                <h3 className="font-bold text-xl mb-3">Share & Collaborate</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Generate shareable links for your diffs. Perfect for code reviews and team collaboration.
                </p>
              </Card>
            </div>
          </div>
        </div>

        {/* Advanced Features */}
        <div className="w-full py-20 px-5">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Advanced Features</h2>
              <p className="text-muted-foreground text-lg">Powerful tools for every use case</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-start gap-3 p-6 rounded-lg border bg-card hover:border-primary/50 transition-colors">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold mb-1">Real-time Validation</p>
                  <p className="text-sm text-muted-foreground">Instant syntax error detection with line numbers</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-6 rounded-lg border bg-card hover:border-primary/50 transition-colors">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Code2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold mb-1">Smart Formatting</p>
                  <p className="text-sm text-muted-foreground">Auto-prettify minified JSON with one click</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-6 rounded-lg border bg-card hover:border-primary/50 transition-colors">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FileJson className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold mb-1">Ignore Options</p>
                  <p className="text-sm text-muted-foreground">Ignore key order, array order, or specific keys</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-6 rounded-lg border bg-card hover:border-primary/50 transition-colors">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Share2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold mb-1">Export & Download</p>
                  <p className="text-sm text-muted-foreground">Copy to clipboard or download as JSON files</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SEO Content Section - Visible to search engines and users */}
        <div className="w-full bg-muted/30 py-20 px-5">
          <div className="max-w-5xl mx-auto space-y-12">
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

        {/* Enhanced Footer */}
        <footer className="w-full border-t bg-muted/50">
          <div className="max-w-7xl mx-auto px-5 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              {/* Brand */}
              <div className="space-y-4">
                <Link href="/" className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                    <FileJson className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <span className="text-lg font-bold">JSON Differ</span>
                </Link>
                <p className="text-sm text-muted-foreground">
                  Professional JSON comparison tool for developers. Compare, validate, and transform JSON with confidence.
                </p>
              </div>

              {/* Product */}
              <div>
                <h3 className="font-semibold mb-4">Product</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link href="/differ" className="hover:text-foreground transition-colors">
                      Compare JSON
                    </Link>
                  </li>
                  <li>
                    <Link href="/differ" className="hover:text-foreground transition-colors">
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link href="/differ" className="hover:text-foreground transition-colors">
                      Demo
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h3 className="font-semibold mb-4">Resources</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <a href="#faq" className="hover:text-foreground transition-colors">
                      FAQ
                    </a>
                  </li>
                  <li>
                    <a href="#how-to" className="hover:text-foreground transition-colors">
                      Documentation
                    </a>
                  </li>
                  <li>
                    <a href="#use-cases" className="hover:text-foreground transition-colors">
                      Use Cases
                    </a>
                  </li>
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h3 className="font-semibold mb-4">Legal</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link href="/" className="hover:text-foreground transition-colors">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/" className="hover:text-foreground transition-colors">
                      Terms of Service
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                © 2024 JSON Differ. All rights reserved.
              </p>
              <div className="flex items-center gap-4">
                <p className="text-xs text-muted-foreground">
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
              </div>
            </div>
          </div>
        </footer>
      </div>
    </main>
    </>
  );
}
