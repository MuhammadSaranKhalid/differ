'use client';

import { useState, useCallback } from 'react';
import { Editor } from '@monaco-editor/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  validateAgainstSchema,
  generateSchemaFromJson,
  getSchemaTemplate,
  SCHEMA_TEMPLATES,
} from '@/lib/schema-validator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CheckCircle2, AlertCircle, Wand2, FileJson, ChevronDown } from 'lucide-react';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';

interface SchemaValidatorPanelProps {
  json: string;
}

export function SchemaValidatorPanel({ json }: SchemaValidatorPanelProps) {
  const { theme } = useTheme();
  const [schema, setSchema] = useState('');
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    errors?: { path: string; message: string; keyword: string }[];
  } | null>(null);
  const [mounted, setMounted] = useState(false);

  useState(() => {
    setMounted(true);
  });

  const handleValidate = useCallback(() => {
    if (!json || !schema) {
      toast.error('Please provide both JSON and Schema');
      return;
    }

    const result = validateAgainstSchema(json, schema);
    setValidationResult(result);
    if (result.isValid) {
      toast.success('JSON is valid against schema!');
    } else {
      toast.error('Validation failed. See errors below.');
    }
  }, [json, schema]);

  const handleGenerateSchema = useCallback(() => {
    if (!json) {
      toast.error('Please provide JSON first');
      return;
    }

    try {
      const generated = generateSchemaFromJson(json);
      setSchema(generated);
      setValidationResult(null);
      toast.success('Schema generated successfully!');
    } catch (error) {
      toast.error(`Failed to generate schema: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [json]);

  const handleLoadTemplate = useCallback((templateName: keyof typeof SCHEMA_TEMPLATES) => {
    const template = getSchemaTemplate(templateName);
    setSchema(template);
    setValidationResult(null);
  }, []);

  if (!mounted) {
    return <div className="animate-pulse bg-muted h-96 rounded-lg" />;
  }

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-lg">JSON Schema Validation</h3>
            <p className="text-sm text-muted-foreground">
              Validate your JSON against a JSON Schema (Draft 07)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <FileJson className="h-4 w-4 mr-2" />
                  Templates
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleLoadTemplate('basic')}>
                  Basic Object
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLoadTemplate('api_response')}>
                  API Response
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLoadTemplate('user')}>
                  User Model
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLoadTemplate('config')}>
                  Configuration
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" size="sm" onClick={handleGenerateSchema}>
              <Wand2 className="h-4 w-4 mr-2" />
              Generate Schema
            </Button>

            <Button onClick={handleValidate} size="sm">
              Validate
            </Button>
          </div>
        </div>

        {/* Schema Editor */}
        <div className="mb-4">
          <Label className="mb-2 block">JSON Schema</Label>
          <div className="border rounded-lg overflow-hidden">
            <Editor
              height="300px"
              language="json"
              value={schema}
              onChange={(value) => setSchema(value || '')}
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

        {/* Validation Results */}
        {validationResult && (
          <Card className={`p-4 ${validationResult.isValid ? 'bg-green-50 dark:bg-green-950' : 'bg-red-50 dark:bg-red-950'}`}>
            <div className="flex items-start gap-3">
              {validationResult.isValid ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-600">Validation Successful</p>
                    <p className="text-sm text-green-600/80">
                      Your JSON is valid according to the schema
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-red-600 mb-2">
                      Validation Failed ({validationResult.errors?.length} error{validationResult.errors?.length !== 1 ? 's' : ''})
                    </p>
                    <div className="space-y-2">
                      {validationResult.errors?.map((error, idx) => (
                        <div key={idx} className="text-sm text-red-600/90">
                          <Badge variant="outline" className="mr-2 text-red-600 border-red-600">
                            {error.path}
                          </Badge>
                          <span>{error.message}</span>
                          <span className="text-xs text-red-600/70 ml-2">
                            ({error.keyword})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </Card>
        )}

        {/* Help Text */}
        <div className="mt-4 text-xs text-muted-foreground">
          <p>
            💡 <strong>Tip:</strong> Use "Generate Schema" to create a schema from your JSON, or load a template and customize it.
          </p>
        </div>
      </Card>
    </div>
  );
}
