'use client';

import { useState, useEffect } from 'react';
import { diffChars, diffWords, diffLines } from 'diff';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Copy, Download, GitCompareArrows, Split, ChevronRight, ChevronLeft } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export default function Home() {
  const [originalText, setOriginalText] = useState('');
  const [modifiedText, setModifiedText] = useState('');
  const [diffResult, setDiffResult] = useState<{
    original: string;
    modified: string;
    raw: any[];
  } | null>(null);
  const [diffType, setDiffType] = useState('line');
  const [viewType, setViewType] = useState('side-by-side');
  const [copyStatus, setCopyStatus] = useState('Copy Diff Result');
  const [mergeChoices, setMergeChoices] = useState<{ [key: number]: 'original' | 'modified' | null }>({});

  const runDiff = () => {
    let diff;
    switch (diffType) {
      case 'word':
        diff = diffWords(originalText, modifiedText);
        break;
      case 'character':
        diff = diffChars(originalText, modifiedText);
        break;
      default:
        diff = diffLines(originalText, modifiedText);
        break;
    }

    const escapeHtml = (text: string) => {
      return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    };

    const original = diff
      .map((part) => {
        if (part.added) return ''; // Don't show added parts in original
        const color = part.removed ? 'bg-red-200 dark:bg-red-900' : '';
        return `<span class="${color}">${escapeHtml(part.value)}</span>`;
      })
      .join('');

    const modified = diff
      .map((part) => {
        if (part.removed) return ''; // Don't show removed parts in modified
        const color = part.added ? 'bg-green-200 dark:bg-green-900' : '';
        return `<span class="${color}">${escapeHtml(part.value)}</span>`;
      })
      .join('');

    setDiffResult({ original, modified, raw: diff });
  };

  // Re-run diff when diffType changes
  useEffect(() => {
    if (diffResult) {
      runDiff();
    }
  }, [diffType]);

  const copyToClipboard = () => {
    if (diffResult) {
      const diffText = diffResult.raw
        .map((part) => {
          if (part.added) return `+ ${part.value}`;
          if (part.removed) return `- ${part.value}`;
          return `  ${part.value}`;
        })
        .join('');
      navigator.clipboard.writeText(diffText).then(() => {
        setCopyStatus('Copied!');
        setTimeout(() => setCopyStatus('Copy Diff Result'), 2000);
      });
    }
  };

  const downloadJSON = () => {
    if (diffResult) {
      const json = JSON.stringify(diffResult.raw, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'diff.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleMergeChoice = (index: number, choice: 'original' | 'modified') => {
    setMergeChoices((prev) => ({
      ...prev,
      [index]: choice,
    }));
  };

  const getMergedResult = () => {
    if (!diffResult) return '';

    return diffResult.raw
      .map((part, index) => {
        const choice = mergeChoices[index];

        // If it's unchanged, always include it
        if (!part.added && !part.removed) {
          return part.value;
        }

        // If there's a choice made, respect it
        if (choice === 'original' && part.removed) {
          return part.value;
        }
        if (choice === 'modified' && part.added) {
          return part.value;
        }
        if (choice === 'original' && part.added) {
          return '';
        }
        if (choice === 'modified' && part.removed) {
          return '';
        }

        // Default behavior: keep additions, remove deletions
        if (part.added) return part.value;
        if (part.removed) return '';

        return part.value;
      })
      .join('');
  };

  const copyMergedResult = () => {
    const merged = getMergedResult();
    navigator.clipboard.writeText(merged).then(() => {
      alert('Merged result copied to clipboard!');
    });
  };

  return (
    <TooltipProvider>
    <div className='font-sans'>
      <div className='relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden'>
        <div className='layout-container flex h-full grow flex-col'>
          <div className='px-4 sm:px-8 md:px-16 lg:px-24 xl:px-40 flex flex-1 justify-center py-5'>
            <div className='layout-content-container flex flex-col w-full max-w-7xl flex-1'>
              <header className='flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 dark:border-gray-800 px-4 py-3 mb-6'>
                <div className='flex items-center gap-4'>
                  <div className='size-6 text-primary'>
                    <svg
                      fill='none'
                      viewBox='0 0 48 48'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        clipRule='evenodd'
                        d='M39.475 21.6262C40.358 21.4363 40.6863 21.5589 40.7581 21.5934C40.7876 21.655 40.8547 21.857 40.8082 22.3336C40.7408 23.0255 40.4502 24.0046 39.8572 25.2301C38.6799 27.6631 36.5085 30.6631 33.5858 33.5858C30.6631 36.5085 27.6632 38.6799 25.2301 39.8572C24.0046 40.4502 23.0255 40.7407 22.3336 40.8082C21.8571 40.8547 21.6551 40.7875 21.5934 40.7581C21.5589 40.6863 21.4363 40.358 21.6262 39.475C21.8562 38.4054 22.4689 36.9657 23.5038 35.2817C24.7575 33.2417 26.5497 30.9744 28.7621 28.762C30.9744 26.5497 33.2417 24.7574 35.2817 23.5037C36.9657 22.4689 38.4054 21.8562 39.475 21.6262ZM4.41189 29.2403L18.7597 43.5881C19.8813 44.7097 21.4027 44.9179 22.7217 44.7893C24.0585 44.659 25.5148 44.1631 26.9723 43.4579C29.9052 42.0387 33.2618 39.5667 36.4142 36.4142C39.5667 33.2618 42.0387 29.9052 43.4579 26.9723C44.1631 25.5148 44.659 24.0585 44.7893 22.7217C44.9179 21.4027 44.7097 19.8813 43.5881 18.7597L29.2403 4.41187C27.8527 3.02428 25.8765 3.02573 24.2861 3.36776C22.6081 3.72863 20.7334 4.58419 18.8396 5.74801C16.4978 7.18716 13.9881 9.18353 11.5858 11.5858C9.18354 13.988 7.18717 16.4978 5.74802 18.8396C4.58421 20.7334 3.72865 22.6081 3.36778 24.2861C3.02574 25.8765 3.02429 27.8527 4.41189 29.2403Z'
                        fill='currentColor'
                        fillRule='evenodd'
                      ></path>
                    </svg>
                  </div>
                  <h2 className='text-lg font-bold leading-tight tracking-[-0.015em]'>
                    DiffChecker
                  </h2>
                </div>
                <ModeToggle />
              </header>

              <main className='flex flex-col gap-8 px-4'>
                {diffResult && (
                  <Card>
                    <CardContent className='p-6'>
                      <div className='flex flex-col gap-4'>
                        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
                          <h3 className='text-lg font-bold leading-tight tracking-[-0.015em]'>
                            Results
                          </h3>
                          <div className='flex flex-wrap items-center gap-x-4 gap-y-2'>
                            <Tabs value={diffType} onValueChange={setDiffType}>
                              <TabsList>
                                <TabsTrigger value='line'>Line</TabsTrigger>
                                <TabsTrigger value='word'>Word</TabsTrigger>
                                <TabsTrigger value='character'>
                                  Character
                                </TabsTrigger>
                              </TabsList>
                            </Tabs>
                            <div className='flex items-center gap-2'>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant='outline'
                                    size='sm'
                                    onClick={copyToClipboard}
                                  >
                                    <Copy className='h-4 w-4 mr-2' />
                                    {copyStatus}
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Copy the diff result to clipboard</p>
                                </TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant='outline'
                                    size='sm'
                                    onClick={downloadJSON}
                                  >
                                    <Download className='h-4 w-4 mr-2' />
                                    Download Diff as JSON
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Download the diff data as a JSON file</p>
                                </TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant='default'
                                    size='sm'
                                    onClick={copyMergedResult}
                                  >
                                    <Copy className='h-4 w-4 mr-2' />
                                    Copy Merged Result
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Copy the merged result based on your selections</p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          </div>
                        </div>

                        <Tabs value={viewType} onValueChange={setViewType}>
                          <TabsList className='mb-4'>
                            <TabsTrigger value='side-by-side'>
                              <GitCompareArrows className='h-4 w-4 mr-2' />
                              Side-by-side
                            </TabsTrigger>
                            <TabsTrigger value='inline'>
                              <Split className='h-4 w-4 mr-2' />
                              Inline
                            </TabsTrigger>
                          </TabsList>

                          <TabsContent value='side-by-side'>
                            {diffType === 'line' ? (
                              <div className='border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden min-h-64 bg-white dark:bg-gray-950'>
                                {(() => {
                                  let originalLineNum = 1;
                                  let modifiedLineNum = 1;

                                  return diffResult.raw.map((part, index) => {
                                    const isChanged = part.added || part.removed;
                                    const choice = mergeChoices[index];

                                    const lines = part.value.split('\n');
                                    const lineCount = lines.length - 1;

                                    const currentOriginalLine = originalLineNum;
                                    const currentModifiedLine = modifiedLineNum;

                                    if (!part.added) {
                                      originalLineNum += lineCount;
                                    }
                                    if (!part.removed) {
                                      modifiedLineNum += lineCount;
                                    }

                                    return (
                                      <div
                                        key={index}
                                        className={`grid grid-cols-[auto_1fr_auto_auto_1fr] gap-2 p-2 border-b border-gray-100 dark:border-gray-800`}
                                      >
                                        <div className='bg-gray-50 dark:bg-gray-900 px-2 py-1 text-right text-gray-400 dark:text-gray-500 font-mono text-sm select-none'>
                                          {choice
                                            ? lines.slice(0, -1).map((_: string, i: number) => <div key={i} className='leading-5'>{currentOriginalLine + i}</div>)
                                            : !part.added && lines.slice(0, -1).map((_: string, i: number) => <div key={i} className='leading-5'>{currentOriginalLine + i}</div>)}
                                        </div>

                                        <div
                                          className={`font-mono text-sm whitespace-pre-wrap p-2 rounded ${
                                            choice
                                              ? 'bg-green-50 dark:bg-green-950/30'
                                              : part.removed
                                              ? 'bg-red-100 dark:bg-red-900/30'
                                              : part.added
                                              ? 'opacity-20'
                                              : ''
                                          }`}
                                        >
                                          {choice ? (choice === 'original' ? part.value : part.value) : !part.added && part.value}
                                        </div>

                                        <div className='flex flex-row items-center justify-center gap-1 min-w-[80px]'>
                                          {isChanged && !choice && (
                                            <>
                                              <Tooltip>
                                                <TooltipTrigger asChild>
                                                  <Button variant='outline' size='icon' className='h-6 w-6' onClick={() => handleMergeChoice(index, 'original')}>
                                                    <ChevronLeft className='h-3 w-3' />
                                                  </Button>
                                                </TooltipTrigger>
                                                <TooltipContent><p>Use original (left)</p></TooltipContent>
                                              </Tooltip>
                                              <Tooltip>
                                                <TooltipTrigger asChild>
                                                  <Button variant='outline' size='icon' className='h-6 w-6' onClick={() => handleMergeChoice(index, 'modified')}>
                                                    <ChevronRight className='h-3 w-3' />
                                                  </Button>
                                                </TooltipTrigger>
                                                <TooltipContent><p>Use modified (right)</p></TooltipContent>
                                              </Tooltip>
                                            </>
                                          )}
                                        </div>

                                        <div className='bg-gray-50 dark:bg-gray-900 px-2 py-1 text-right text-gray-400 dark:text-gray-500 font-mono text-sm select-none'>
                                          {choice
                                            ? lines.slice(0, -1).map((_, i) => <div key={i} className='leading-5'>{currentModifiedLine + i}</div>)
                                            : !part.removed && lines.slice(0, -1).map((_, i) => <div key={i} className='leading-5'>{currentModifiedLine + i}</div>)}
                                        </div>

                                        <div
                                          className={`font-mono text-sm whitespace-pre-wrap p-2 rounded ${
                                            choice
                                              ? 'bg-green-50 dark:bg-green-950/30'
                                              : part.added
                                              ? 'bg-green-100 dark:bg-green-900/30'
                                              : part.removed
                                              ? 'opacity-20'
                                              : ''
                                          }`}
                                        >
                                          {choice
                                            ? choice === 'original' ? (part.removed ? part.value : '') : part.added ? part.value : ''
                                            : !part.removed && part.value}
                                        </div>
                                      </div>
                                    );
                                  });
                                })()}
                              </div>
                            ) : (
                              <div className="grid grid-cols-2 gap-4 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden min-h-64 bg-white dark:bg-gray-950">
                                <div
                                  className="p-4 font-mono text-sm whitespace-pre-wrap"
                                  dangerouslySetInnerHTML={{
                                    __html: diffResult.original,
                                  }}
                                />
                                <div
                                  className="p-4 font-mono text-sm whitespace-pre-wrap border-l border-gray-200 dark:border-gray-800"
                                  dangerouslySetInnerHTML={{
                                    __html: diffResult.modified,
                                  }}
                                />
                              </div>
                            )}
                          </TabsContent>

                          <TabsContent value='inline'>
                            <div className='grid grid-cols-1 gap-px bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden min-h-64'>
                              <div className='bg-white dark:bg-gray-950 flex'>
                                <div className='bg-gray-50 dark:bg-gray-900 p-2 text-right text-gray-400 dark:text-gray-500 font-mono text-sm select-none'>
                                  {modifiedText.split('\n').map((_, i) => (
                                    <div key={i}>{i + 1}</div>
                                  ))}
                                </div>
                                <div
                                  className='p-4 font-mono text-sm whitespace-pre-wrap flex-1'
                                  dangerouslySetInnerHTML={{
                                    __html: diffResult.modified,
                                  }}
                                ></div>
                              </div>
                            </div>
                          </TabsContent>
                        </Tabs>

                        {diffType === 'line' && Object.keys(mergeChoices).length > 0 && (
                          <div className='mt-6'>
                            <div className='flex justify-between items-center mb-3'>
                              <h4 className='text-base font-semibold'>Merged Result</h4>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant='outline'
                                    size='sm'
                                    onClick={copyMergedResult}
                                  >
                                    <Copy className='h-4 w-4 mr-2' />
                                    Copy Merged
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Copy the merged result to clipboard</p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                            <div className='border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900'>
                              <div className='p-4 font-mono text-sm whitespace-pre-wrap max-h-96 overflow-y-auto'>
                                {getMergedResult()}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardContent className='p-6'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      <div className='flex flex-col gap-2'>
                        <Label
                          htmlFor='original-text'
                          className='text-base font-medium leading-normal'
                        >
                          Original Text
                        </Label>
                        <Textarea
                          id='original-text'
                          placeholder='Paste the original text here.'
                          className='h-64'
                          value={originalText}
                          onChange={(e) => setOriginalText(e.target.value)}
                        />
                      </div>
                      <div className='flex flex-col gap-2'>
                        <Label
                          htmlFor='modified-text'
                          className='text-base font-medium leading-normal'
                        >
                          Modified Text
                        </Label>
                        <Textarea
                          id='modified-text'
                          placeholder='Paste the modified text here.'
                          className='h-64'
                          value={modifiedText}
                          onChange={(e) => setModifiedText(e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className='flex flex-col items-center justify-center gap-6 pt-2'>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button onClick={runDiff} className='w-full sm:w-auto'>
                        Run Diff
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Compare the original and modified text</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </main>
            </div>
          </div>
        </div>
      </div>
    </div>
    </TooltipProvider>
  );
}
