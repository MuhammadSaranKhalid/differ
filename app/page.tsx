
"use client";

import { useState } from "react";
import { diffChars, diffWords, diffLines } from "diff";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Moon, Sun, Copy, Download, GitCompareArrows, Split } from "lucide-react";

export default function Home() {
  const [theme, setTheme] = useState("dark");
  const [originalText, setOriginalText] = useState("");
  const [modifiedText, setModifiedText] = useState("");
  const [diffResult, setDiffResult] = useState(null);
  const [diffType, setDiffType] = useState("line");
  const [viewType, setViewType] = useState("side-by-side");
  const [copyStatus, setCopyStatus] = useState("Copy Diff Result");

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
    document.documentElement.classList.toggle("dark");
  };

  const runDiff = () => {
    let diff;
    switch (diffType) {
      case "word":
        diff = diffWords(originalText, modifiedText);
        break;
      case "character":
        diff = diffChars(originalText, modifiedText);
        break;
      default:
        diff = diffLines(originalText, modifiedText);
        break;
    }

    const original = diff.map((part) => {
      const color = part.added ? "bg-[#4caf50]/40 dark:bg-[#4caf50]/30" : part.removed ? "bg-[#ff4d4d]/40 dark:bg-[#ff4d4d]/30" : "";
      return `<span class="${color}">${part.value}</span>`;
    }).join("");

    const modified = diff.map((part) => {
      const color = part.added ? "bg-[#4caf50]/40 dark:bg-[#4caf50]/30" : part.removed ? "bg-[#ff4d4d]/40 dark:bg-[#ff4d4d]/30" : "";
      return `<span class="${color}">${part.value}</span>`;
    }).join("");

    setDiffResult({ original, modified, raw: diff });
  };

  const copyToClipboard = () => {
    if (diffResult) {
      const diffText = diffResult.raw.map(part => {
        if (part.added) return `+ ${part.value}`;
        if (part.removed) return `- ${part.value}`;
        return `  ${part.value}`;
      }).join('');
      navigator.clipboard.writeText(diffText).then(() => {
        setCopyStatus("Copied!");
        setTimeout(() => setCopyStatus("Copy Diff Result"), 2000);
      });
    }
  };

  const downloadJSON = () => {
    if (diffResult) {
      const json = JSON.stringify(diffResult.raw, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "diff.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className={`font-display ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden bg-background-light dark:bg-background-dark text-[#1a1a1a] dark:text-[#E0E0E0]">
        <div className="layout-container flex h-full grow flex-col">
          <div className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-40 flex flex-1 justify-center py-5">
            <div className="layout-content-container flex flex-col w-full max-w-7xl flex-1">
              <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#E0E0E0] dark:border-[#333333] px-4 py-3 mb-6">
                <div className="flex items-center gap-4">
                  <div className="size-6 text-primary">
                    <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                      <path
                        clipRule="evenodd"
                        d="M39.475 21.6262C40.358 21.4363 40.6863 21.5589 40.7581 21.5934C40.7876 21.655 40.8547 21.857 40.8082 22.3336C40.7408 23.0255 40.4502 24.0046 39.8572 25.2301C38.6799 27.6631 36.5085 30.6631 33.5858 33.5858C30.6631 36.5085 27.6632 38.6799 25.2301 39.8572C24.0046 40.4502 23.0255 40.7407 22.3336 40.8082C21.8571 40.8547 21.6551 40.7875 21.5934 40.7581C21.5589 40.6863 21.4363 40.358 21.6262 39.475C21.8562 38.4054 22.4689 36.9657 23.5038 35.2817C24.7575 33.2417 26.5497 30.9744 28.7621 28.762C30.9744 26.5497 33.2417 24.7574 35.2817 23.5037C36.9657 22.4689 38.4054 21.8562 39.475 21.6262ZM4.41189 29.2403L18.7597 43.5881C19.8813 44.7097 21.4027 44.9179 22.7217 44.7893C24.0585 44.659 25.5148 44.1631 26.9723 43.4579C29.9052 42.0387 33.2618 39.5667 36.4142 36.4142C39.5667 33.2618 42.0387 29.9052 43.4579 26.9723C44.1631 25.5148 44.659 24.0585 44.7893 22.7217C44.9179 21.4027 44.7097 19.8813 43.5881 18.7597L29.2403 4.41187C27.8527 3.02428 25.8765 3.02573 24.2861 3.36776C22.6081 3.72863 20.7334 4.58419 18.8396 5.74801C16.4978 7.18716 13.9881 9.18353 11.5858 11.5858C9.18354 13.988 7.18717 16.4978 5.74802 18.8396C4.58421 20.7334 3.72865 22.6081 3.36778 24.2861C3.02574 25.8765 3.02429 27.8527 4.41189 29.2403Z"
                        fill="currentColor"
                        fillRule="evenodd"
                      ></path>
                    </svg>
                  </div>
                  <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">DiffChecker</h2>
                </div>
                <Button variant="ghost" size="icon" aria-label="Toggle theme" onClick={toggleTheme}>
                  {theme === "light" ? <Moon className="h-6 w-6" /> : <Sun className="h-6 w-6" />}
                </Button>
              </header>

              <main className="flex flex-col gap-8 px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <Label htmlFor="original-text" className="text-base font-medium leading-normal pb-2">
                      Original Text
                    </Label>
                    <Textarea
                      id="original-text"
                      placeholder="Paste the original text here."
                      className="h-64"
                      value={originalText}
                      onChange={(e) => setOriginalText(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col">
                    <Label htmlFor="modified-text" className="text-base font-medium leading-normal pb-2">
                      Modified Text
                    </Label>
                    <Textarea
                      id="modified-text"
                      placeholder="Paste the modified text here."
                      className="h-64"
                      value={modifiedText}
                      onChange={(e) => setModifiedText(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center gap-6 pt-2">
                  <Button onClick={runDiff} className="w-full sm:w-auto">
                    Run Diff
                  </Button>
                </div>

                <div className="flex flex-col gap-4 pt-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold leading-tight tracking-[-0.015em]">Results</h3>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                      <ToggleGroup type="single" defaultValue="line" variant="outline" onValueChange={(value) => setDiffType(value)}>
                        <ToggleGroupItem value="line">Line</ToggleGroupItem>
                        <ToggleGroupItem value="word">Word</ToggleGroupItem>
                        <ToggleGroupItem value="character">Character</ToggleGroupItem>
                      </ToggleGroup>
                      <ToggleGroup type="single" defaultValue="side-by-side" variant="outline" onValueChange={(value) => setViewType(value)}>
                        <ToggleGroupItem value="side-by-side"><GitCompareArrows className="h-4 w-4 mr-2" />Side-by-side</ToggleGroupItem>
                        <ToggleGroupItem value="inline"><Split className="h-4 w-4 mr-2" />Inline</ToggleGroupItem>
                      </ToggleGroup>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={copyToClipboard}><Copy className="h-4 w-4 mr-2" />{copyStatus}</Button>
                        <Button variant="outline" size="sm" onClick={downloadJSON}><Download className="h-4 w-4 mr-2" />Download Diff as JSON</Button>
                      </div>
                    </div>
                  </div>

                  {diffResult && (
                    <div
                      className={`grid ${viewType === "side-by-side" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"} gap-px bg-[#E0E0E0] dark:bg-[#333333] border border-[#E0E0E0] dark:border-[#333333] rounded-lg overflow-hidden min-h-64`}>
                      <div className="bg-white dark:bg-[#1a1a1a] flex">
                        <div className="bg-background-light dark:bg-[#222222] p-2 text-right text-gray-400 dark:text-gray-500 font-mono text-sm select-none">
                          {originalText.split('').map((_, i) => <div key={i}>{i + 1}</div>)}
                        </div>
                        <div className="p-4 font-mono text-sm whitespace-pre-wrap flex-1" dangerouslySetInnerHTML={{ __html: diffResult.original }}></div>
                      </div>
                      {viewType === "side-by-side" && (
                        <div className="bg-white dark:bg-[#1a1a1a] flex">
                          <div className="bg-background-light dark:bg-[#222222] p-2 text-right text-gray-400 dark:text-gray-500 font-mono text-sm select-none">
                            {modifiedText.split('').map((_, i) => <div key={i}>{i + 1}</div>)}
                          </div>
                          <div className="p-4 font-mono text-sm whitespace-pre-wrap flex-1" dangerouslySetInnerHTML={{ __html: diffResult.modified }}></div>
                        </div>
                      )}
                      {viewType === "inline" && (
                        <div className="bg-white dark:bg-[#1a1a1a] flex">
                          <div className="bg-background-light dark:bg-[#222222] p-2 text-right text-gray-400 dark:text-gray-500 font-mono text-sm select-none">
                            {/* Placeholder for line numbers in inline view */}
                          </div>
                          <div className="p-4 font-mono text-sm whitespace-pre-wrap flex-1" dangerouslySetInnerHTML={{ __html: diffResult.modified }}></div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </main>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
