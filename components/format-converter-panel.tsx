'use client';

import { useState, useCallback } from 'react';
import { Editor } from '@monaco-editor/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  convert,
  detectFormat,
  type SupportedFormat,
  getFileExtension,
} from '@/lib/format-converter';
import { ArrowRight, Download, Copy, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';

const SAMPLE_JSON = `{
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30,
  "active": true
}`;

const SAMPLE_YAML = `name: John Doe
email: john@example.com
age: 30
active: true`;

const SAMPLE_XML = `<?xml version="1.0" encoding="UTF-8"?>
<person>
  <name>John Doe</name>
  <email>john@example.com</email>
  <age>30</age>
  <active>true</active>
</person>`;

export function FormatConverterPanel() {
  const { theme } = useTheme();
  const [input, setInput] = useState(SAMPLE_JSON);
  const [output, setOutput] = useState('');
  const [fromFormat, setFromFormat] = useState<SupportedFormat>('json');
  const [toFormat, setToFormat] = useState<SupportedFormat>('yaml');
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useState(() => {
    setMounted(true);
  });

  const handleConvert = useCallback(() => {
    setError(null);

    const result = convert(input, fromFormat, toFormat);

    if (result.success && result.data) {
      setOutput(result.data);
    } else {
      setError(result.error || 'Conversion failed');
      setOutput('');
    }
  }, [input, fromFormat, toFormat]);

  const handleAutoDetect = useCallback(() => {
    const detected = detectFormat(input);
    setFromFormat(detected);
    setError(null);
  }, [input]);

  const handleLoadSample = useCallback((format: SupportedFormat) => {
    switch (format) {
      case 'json':
        setInput(SAMPLE_JSON);
        break;
      case 'yaml':
        setInput(SAMPLE_YAML);
        break;
      case 'xml':
        setInput(SAMPLE_XML);
        break;
    }
    setFromFormat(format);
    setOutput('');
    setError(null);
  }, []);

  const handleCopy = useCallback(async () => {
    if (!output) return;

    try {
      await navigator.clipboard.writeText(output);
      toast.success('Copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy');
    }
  }, [output]);

  const handleDownload = useCallback(() => {
    if (!output) return;

    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `converted.${getFileExtension(toFormat)}`;
    a.click();
    URL.revokeObjectURL(url);
  }, [output, toFormat]);

  const handleSwapFormats = useCallback(() => {
    setFromFormat(toFormat);
    setToFormat(fromFormat);
    setInput(output || input);
    setOutput('');
    setError(null);
  }, [fromFormat, toFormat, input, output]);

  if (!mounted) {
    return <div className="animate-pulse bg-muted h-96 rounded-lg" />;
  }

  const getLanguage = (format: SupportedFormat): string => {
    return format === 'json' ? 'json' : format === 'yaml' ? 'yaml' : 'xml';
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-lg">Format Converter</h3>
            <p className="text-sm text-muted-foreground">
              Convert between JSON, YAML, and XML formats
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleAutoDetect}>
              Auto-Detect Format
            </Button>
          </div>
        </div>

        {/* Format Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <Label className="mb-2 block">From Format</Label>
            <Select value={fromFormat} onValueChange={(value) => setFromFormat(value as SupportedFormat)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="yaml">YAML</SelectItem>
                <SelectItem value="xml">XML</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end justify-center">
            <Button variant="ghost" size="sm" onClick={handleSwapFormats}>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div>
            <Label className="mb-2 block">To Format</Label>
            <Select value={toFormat} onValueChange={(value) => setToFormat(value as SupportedFormat)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="yaml">YAML</SelectItem>
                <SelectItem value="xml">XML</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Sample Buttons */}
        <div className="flex gap-2 mb-4">
          <Button variant="outline" size="sm" onClick={() => handleLoadSample('json')}>
            Load JSON Sample
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleLoadSample('yaml')}>
            Load YAML Sample
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleLoadSample('xml')}>
            Load XML Sample
          </Button>
        </div>

        {/* Editors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <Label className="mb-2 block">Input ({fromFormat.toUpperCase()})</Label>
            <div className="border rounded-lg overflow-hidden">
              <Editor
                height="400px"
                language={getLanguage(fromFormat)}
                value={input}
                onChange={(value) => setInput(value || '')}
                theme={theme === 'dark' ? 'vs-dark' : 'light'}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  wordWrap: 'on',
                }}
              />
            </div>
          </div>

          <div>
            <Label className="mb-2 block">Output ({toFormat.toUpperCase()})</Label>
            <div className="border rounded-lg overflow-hidden">
              <Editor
                height="400px"
                language={getLanguage(toFormat)}
                value={output}
                theme={theme === 'dark' ? 'vs-dark' : 'light'}
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  wordWrap: 'on',
                }}
              />
            </div>
          </div>
        </div>

        {/* Convert Button */}
        <div className="flex items-center justify-between">
          <Button onClick={handleConvert} size="lg">
            <ArrowRight className="h-4 w-4 mr-2" />
            Convert {fromFormat.toUpperCase()} to {toFormat.toUpperCase()}
          </Button>

          {output && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCopy}>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          )}
        </div>

        {/* Error/Success Messages */}
        {error && (
          <Card className="mt-4 p-4 bg-red-50 dark:bg-red-950 border-red-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <p className="font-medium text-red-600">Conversion Failed</p>
                <p className="text-sm text-red-600/80">{error}</p>
              </div>
            </div>
          </Card>
        )}

        {output && !error && (
          <Card className="mt-4 p-4 bg-green-50 dark:bg-green-950 border-green-200">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-green-600">Conversion Successful</p>
                <p className="text-sm text-green-600/80">
                  Converted from {fromFormat.toUpperCase()} to {toFormat.toUpperCase()}
                </p>
              </div>
            </div>
          </Card>
        )}
      </Card>
    </div>
  );
}
