"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import {
  diff_match_patch,
  DIFF_DELETE,
  DIFF_INSERT,
  DIFF_EQUAL,
} from "diff-match-patch";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Copy,
  Download,
  GitCompareArrows,
  Split,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Search,
  FileText,
  BarChart3,
  Keyboard,
  X,
} from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import {
  Tooltip,
  TooltipProvider,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const dmp = new diff_match_patch();

const escapeHtml = (text: string) => {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

interface DiffStats {
  additions: number;
  deletions: number;
  modifications: number;
  unchanged: number;
}

export default function Home() {
  const [originalText, setOriginalText] = useState("");
  const [modifiedText, setModifiedText] = useState("");
  const [diffResult, setDiffResult] = useState<any[] | null>(null);
  const diffType = "line"; // Always use line mode
  const viewType = "side-by-side"; // Always use side-by-side view
  const [mergeChoices, setMergeChoices] = useState<{
    [key: number]: "original" | "modified" | null;
  }>({});
  const [contextLines, setContextLines] = useState(3);
  const [showUnchanged, setShowUnchanged] = useState(true);
  const [collapsedSections, setCollapsedSections] = useState<Set<number>>(
    new Set()
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [splitRatio, setSplitRatio] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const leftScrollRef = useRef<HTMLDivElement>(null);
  const rightScrollRef = useRef<HTMLDivElement>(null);
  const [syncScroll, setSyncScroll] = useState(true);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Enter: Run diff
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        if (originalText && modifiedText) {
          runDiff();
        }
      }
      // Ctrl/Cmd + K: Focus search
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        document.getElementById("search-input")?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [originalText, modifiedText, diffResult]);

  // Synchronized scrolling
  const handleScroll = useCallback(
    (source: "left" | "right") => {
      if (!syncScroll) return;

      return (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.currentTarget;
        const other =
          source === "left" ? rightScrollRef.current : leftScrollRef.current;

        if (other) {
          other.scrollTop = target.scrollTop;
        }
      };
    },
    [syncScroll]
  );

  // Resizable split view
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const container = document.getElementById("split-container");
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const newRatio = ((e.clientX - rect.left) / rect.width) * 100;
      setSplitRatio(Math.min(Math.max(newRatio, 20), 80));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const runDiff = (type?: string) => {
    let diffs;
    const text1 = originalText.replace(/\r\n/g, "\n");
    const text2 = modifiedText.replace(/\r\n/g, "\n");
    const currentDiffType = type || diffType;

    switch (currentDiffType) {
      case "word":
        diffs = dmp.diff_main(text1, text2);
        dmp.diff_cleanupSemantic(diffs);
        break;

      case "character":
        diffs = dmp.diff_main(text1, text2);
        dmp.diff_cleanupSemantic(diffs);
        break;

      default: // LINE MODE
        const lineData = dmp.diff_linesToChars_(text1, text2);
        diffs = dmp.diff_main(lineData.chars1, lineData.chars2, false);
        dmp.diff_charsToLines_(diffs, lineData.lineArray);
        dmp.diff_cleanupSemantic(diffs);
        break;
    }

    setDiffResult(diffs);
    setMergeChoices({});
    setCollapsedSections(new Set());
  };

  const diffStats = useMemo((): DiffStats => {
    if (!diffResult)
      return { additions: 0, deletions: 0, modifications: 0, unchanged: 0 };

    let stats: DiffStats = {
      additions: 0,
      deletions: 0,
      modifications: 0,
      unchanged: 0,
    };

    if (diffType === "line") {
      let i = 0;
      while (i < diffResult.length) {
        const [type, value] = diffResult[i];
        const lines = value.split("\n").filter((l: string) => l !== "");

        if (type === DIFF_EQUAL) {
          stats.unchanged += lines.length;
          i++;
        } else if (type === DIFF_DELETE) {
          const nextPart = diffResult[i + 1];
          if (nextPart && nextPart[0] === DIFF_INSERT) {
            const deletedLines = lines.length;
            const addedLines = nextPart[1]
              .split("\n")
              .filter((l: string) => l !== "").length;
            stats.modifications += Math.min(deletedLines, addedLines);
            stats.deletions += Math.max(0, deletedLines - addedLines);
            stats.additions += Math.max(0, addedLines - deletedLines);
            i += 2;
          } else {
            stats.deletions += lines.length;
            i++;
          }
        } else if (type === DIFF_INSERT) {
          stats.additions += lines.length;
          i++;
        }
      }
    } else {
      diffResult.forEach(([type]) => {
        if (type === DIFF_INSERT) stats.additions++;
        else if (type === DIFF_DELETE) stats.deletions++;
        else stats.unchanged++;
      });
    }

    return stats;
  }, [diffResult, diffType]);

  const alignedLineDiff = useMemo(() => {
    if (!diffResult || diffType !== "line") return [];

    const alignedRows: Array<{
      originalLine: string;
      modifiedLine: string;
      originalHtml: string;
      modifiedHtml: string;
      type: "unchanged" | "modified" | "added" | "removed";
      index: number;
      sectionStart?: boolean;
      sectionSize?: number;
    }> = [];

    let index = 0;
    let i = 0;
    let unchangedCount = 0;
    let sectionStartIndex = -1;

    const finalizeSectionIfNeeded = () => {
      if (
        unchangedCount > contextLines * 2 &&
        !showUnchanged &&
        sectionStartIndex >= 0
      ) {
        alignedRows[sectionStartIndex].sectionStart = true;
        alignedRows[sectionStartIndex].sectionSize = unchangedCount;
      }
      unchangedCount = 0;
      sectionStartIndex = -1;
    };

    while (i < diffResult.length) {
      const [type, value] = diffResult[i];
      // The value from diff_charsToLines_ already includes newlines
      // Just remove trailing newline and treat as single unit, or split if multiple lines
      const lines = value.split("\n").filter((l: string) => l !== "");

      if (type === DIFF_EQUAL) {
        lines.forEach((line: string, lineIdx: number) => {
          if (line === "") return;

          if (unchangedCount === 0) {
            sectionStartIndex = alignedRows.length;
          }
          unchangedCount++;

          alignedRows.push({
            originalLine: line,
            modifiedLine: line,
            originalHtml: escapeHtml(line),
            modifiedHtml: escapeHtml(line),
            type: "unchanged",
            index: index++,
          });
        });
        i++;
      } else {
        finalizeSectionIfNeeded();

        if (type === DIFF_DELETE) {
          const nextPart = diffResult[i + 1];
          if (nextPart && nextPart[0] === DIFF_INSERT) {
            const removedLines = lines;
            const addedLines = nextPart[1]
              .split("\n")
              .filter((l: string) => l !== "");
            const maxLen = Math.max(removedLines.length, addedLines.length);

            for (let j = 0; j < maxLen; j++) {
              const oldLine = removedLines[j];
              const newLine = addedLines[j];

              if (oldLine !== undefined && newLine !== undefined) {
                const wordDiffs = dmp.diff_main(oldLine, newLine);
                dmp.diff_cleanupSemantic(wordDiffs);
                const oldHtml = wordDiffs
                  .map(([type, value]) => {
                    if (type === DIFF_DELETE)
                      return `<span class="bg-red-300 dark:bg-red-700 px-0.5 rounded">${escapeHtml(
                        value
                      )}</span>`;
                    if (type === DIFF_INSERT) return "";
                    return escapeHtml(value);
                  })
                  .join("");
                const newHtml = wordDiffs
                  .map(([type, value]) => {
                    if (type === DIFF_INSERT)
                      return `<span class="bg-green-300 dark:bg-green-700 px-0.5 rounded">${escapeHtml(
                        value
                      )}</span>`;
                    if (type === DIFF_DELETE) return "";
                    return escapeHtml(value);
                  })
                  .join("");
                alignedRows.push({
                  originalLine: oldLine,
                  modifiedLine: newLine,
                  originalHtml: oldHtml,
                  modifiedHtml: newHtml,
                  type: "modified",
                  index: index++,
                });
              } else if (oldLine !== undefined) {
                alignedRows.push({
                  originalLine: oldLine,
                  modifiedLine: "",
                  originalHtml: escapeHtml(oldLine),
                  modifiedHtml: "&nbsp;",
                  type: "removed",
                  index: index++,
                });
              } else if (newLine !== undefined) {
                alignedRows.push({
                  originalLine: "",
                  modifiedLine: newLine,
                  originalHtml: "&nbsp;",
                  modifiedHtml: escapeHtml(newLine),
                  type: "added",
                  index: index++,
                });
              }
            }
            i += 2;
          } else {
            lines.forEach((line: string) => {
              if (line === "") return;
              alignedRows.push({
                originalLine: line,
                modifiedLine: "",
                originalHtml: escapeHtml(line),
                modifiedHtml: "&nbsp;",
                type: "removed",
                index: index++,
              });
            });
            i++;
          }
        } else if (type === DIFF_INSERT) {
          lines.forEach((line: string) => {
            if (line === "") return;
            alignedRows.push({
              originalLine: "",
              modifiedLine: line,
              originalHtml: "&nbsp;",
              modifiedHtml: escapeHtml(line),
              type: "added",
              index: index++,
            });
          });
          i++;
        }
      }
    }

    finalizeSectionIfNeeded();
    return alignedRows;
  }, [diffResult, diffType, contextLines, showUnchanged]);

  const filteredLineDiff = useMemo(() => {
    if (!searchTerm) return alignedLineDiff;

    const lowerSearch = searchTerm.toLowerCase();
    return alignedLineDiff.filter(
      (row) =>
        row.originalLine.toLowerCase().includes(lowerSearch) ||
        row.modifiedLine.toLowerCase().includes(lowerSearch)
    );
  }, [alignedLineDiff, searchTerm]);

  const inlineDiffHtml = useMemo(() => {
    if (!diffResult) return "";
    return diffResult
      .map(([type, value]) => {
        const color =
          type === DIFF_INSERT
            ? "bg-green-200 dark:bg-green-900"
            : type === DIFF_DELETE
            ? "bg-red-200 dark:bg-red-900"
            : "";
        return `<span class="${color}">${escapeHtml(value)}</span>`;
      })
      .join("");
  }, [diffResult]);

  const sideBySideDiffHtml = useMemo(() => {
    if (!diffResult) return { original: "", modified: "" };
    const original = diffResult
      .map(([type, value]) => {
        if (type === DIFF_INSERT) return "";
        const color =
          type === DIFF_DELETE
            ? "bg-red-200 dark:bg-red-900 rounded px-0.5"
            : "";
        return `<span class="${color}">${escapeHtml(value)}</span>`;
      })
      .join("");
    const modified = diffResult
      .map(([type, value]) => {
        if (type === DIFF_DELETE) return "";
        const color =
          type === DIFF_INSERT
            ? "bg-green-200 dark:bg-green-900 rounded px-0.5"
            : "";
        return `<span class="${color}">${escapeHtml(value)}</span>`;
      })
      .join("");
    return { original, modified };
  }, [diffResult]);

  const copyOriginalText = () => {
    const originalLines = alignedLineDiff
      .map(row => row.originalLine)
      .filter(line => line !== "")
      .join("\n");
    navigator.clipboard.writeText(originalLines);
  };

  const copyModifiedText = () => {
    const modifiedLines = alignedLineDiff
      .map(row => row.modifiedLine)
      .filter(line => line !== "")
      .join("\n");
    navigator.clipboard.writeText(modifiedLines);
  };

  const downloadJSON = () => {
    if (diffResult) {
      const json = JSON.stringify(diffResult, null, 2);
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

  const downloadUnifiedDiff = () => {
    if (!diffResult) return;

    let unifiedDiff = "--- Original\n+++ Modified\n";

    if (diffType === "line") {
      let originalLineNum = 1;
      let modifiedLineNum = 1;
      let hunkLines: string[] = [];
      let hunkOriginalStart = 1;
      let hunkModifiedStart = 1;

      alignedLineDiff.forEach((row, idx) => {
        if (row.type === "unchanged") {
          if (hunkLines.length > 0) {
            unifiedDiff += `@@ -${hunkOriginalStart},${
              originalLineNum - hunkOriginalStart
            } +${hunkModifiedStart},${
              modifiedLineNum - hunkModifiedStart
            } @@\n`;
            unifiedDiff += hunkLines.join("\n") + "\n";
            hunkLines = [];
          }
          originalLineNum++;
          modifiedLineNum++;
          hunkOriginalStart = originalLineNum;
          hunkModifiedStart = modifiedLineNum;
        } else if (row.type === "removed") {
          hunkLines.push(`-${row.originalLine}`);
          originalLineNum++;
        } else if (row.type === "added") {
          hunkLines.push(`+${row.modifiedLine}`);
          modifiedLineNum++;
        } else if (row.type === "modified") {
          hunkLines.push(`-${row.originalLine}`);
          hunkLines.push(`+${row.modifiedLine}`);
          originalLineNum++;
          modifiedLineNum++;
        }
      });

      if (hunkLines.length > 0) {
        unifiedDiff += `@@ -${hunkOriginalStart},${
          originalLineNum - hunkOriginalStart
        } +${hunkModifiedStart},${modifiedLineNum - hunkModifiedStart} @@\n`;
        unifiedDiff += hunkLines.join("\n") + "\n";
      }
    } else {
      diffResult.forEach(([type, value]) => {
        if (type === DIFF_INSERT) unifiedDiff += `+${value}`;
        else if (type === DIFF_DELETE) unifiedDiff += `-${value}`;
        else unifiedDiff += ` ${value}`;
      });
    }

    const blob = new Blob([unifiedDiff], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "diff.patch";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleMergeChoice = (
    index: number,
    choice: "original" | "modified"
  ) => {
    setMergeChoices((prev) => ({ ...prev, [index]: choice }));
  };

  const toggleSection = (index: number) => {
    setCollapsedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const getMergedResult = () => {
    if (diffType !== "line") {
      return (
        diffResult
          ?.map(([type, value]) => {
            if (type !== DIFF_DELETE) return value;
            return "";
          })
          .join("") || ""
      );
    }

    return alignedLineDiff
      .map((row) => {
        const choice = mergeChoices[row.index];
        if (choice === "original") return row.originalLine;
        if (choice === "modified") return row.modifiedLine;
        if (row.type === "added") return row.modifiedLine;
        if (row.type === "removed") return "";
        return row.originalLine;
      })
      .filter((line) => line !== "")
      .join("\n");
  };


  return (
    <TooltipProvider>
      <div className="font-sans">
        <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
          <div className="layout-container flex h-full grow flex-col">
            <div className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-40 flex flex-1 justify-center py-5">
              <div className="layout-content-container flex flex-col w-full max-w-7xl flex-1">
                <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 dark:border-gray-800 px-4 py-3 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="size-6 text-primary">
                      <svg
                        fill="none"
                        viewBox="0 0 48 48"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          clipRule="evenodd"
                          d="M39.475 21.6262C40.358 21.4363 40.6863 21.5589 40.7581 21.5934C40.7876 21.655 40.8547 21.857 40.8082 22.3336C40.7408 23.0255 40.4502 24.0046 39.8572 25.2301C38.6799 27.6631 36.5085 30.6631 33.5858 33.5858C30.6631 36.5085 27.6632 38.6799 25.2301 39.8572C24.0046 40.4502 23.0255 40.7407 22.3336 40.8082C21.8571 40.8547 21.6551 40.7875 21.5934 40.7581C21.5589 40.6863 21.4363 40.358 21.6262 39.475C21.8562 38.4054 22.4689 36.9657 23.5038 35.2817C24.7575 33.2417 26.5497 30.9744 28.7621 28.762C30.9744 26.5497 33.2417 24.7574 35.2817 23.5037C36.9657 22.4689 38.4054 21.8562 39.475 21.6262ZM4.41189 29.2403L18.7597 43.5881C19.8813 44.7097 21.4027 44.9179 22.7217 44.7893C24.0585 44.659 25.5148 44.1631 26.9723 43.4579C29.9052 42.0387 33.2618 39.5667 36.4142 36.4142C39.5667 33.2618 42.0387 29.9052 43.4579 26.9723C44.1631 25.5148 44.659 24.0585 44.7893 22.7217C44.9179 21.4027 44.7097 19.8813 43.5881 18.7597L29.2403 4.41187C27.8527 3.02428 25.8765 3.02573 24.2861 3.36776C22.6081 3.72863 20.7334 4.58419 18.8396 5.74801C16.4978 7.18716 13.9881 9.18353 11.5858 11.5858C9.18354 13.988 7.18717 16.4978 5.74802 18.8396C4.58421 20.7334 3.72865 22.6081 3.36778 24.2861C3.02574 25.8765 3.02429 27.8527 4.41189 29.2403Z"
                          fill="currentColor"
                          fillRule="evenodd"
                        ></path>
                      </svg>
                    </div>
                    <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">
                      DiffChecker
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Keyboard className="h-5 w-5" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Keyboard Shortcuts</DialogTitle>
                          <DialogDescription>
                            <div className="space-y-2 mt-4">
                              <div className="flex justify-between">
                                <span>Run Diff</span>
                                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
                                  Ctrl/Cmd + Enter
                                </kbd>
                              </div>
                              <div className="flex justify-between">
                                <span>Focus Search</span>
                                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
                                  Ctrl/Cmd + K
                                </kbd>
                              </div>
                            </div>
                          </DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                    <ModeToggle />
                  </div>
                </header>

                <main className="flex flex-col gap-8 px-4">
                  {diffResult && (
                    <>
                      <div className="flex flex-col gap-4">
                        <div className="sticky top-0 z-50 bg-white dark:bg-gray-950 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 pt-4 border-b border-gray-200 dark:border-gray-800">
                          <h3 className="text-lg font-bold leading-tight tracking-[-0.015em]">
                            Results
                          </h3>
                          <div className="flex flex-wrap items-center gap-2">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={downloadJSON}
                                >
                                  <Download className="h-4 w-4 mr-2" />
                                  JSON
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Download as JSON</p>
                              </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={downloadUnifiedDiff}
                                >
                                  <FileText className="h-4 w-4 mr-2" />
                                  Patch
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Download as unified diff patch</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </div>

                        {/* Search and Controls */}
                        {diffType === "line" && (
                          <div className="flex flex-wrap gap-4 items-center">
                            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                              <Search className="h-4 w-4 text-gray-500" />
                              <Input
                                id="search-input"
                                type="text"
                                placeholder="Search in diff..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="flex-1"
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <Label
                                htmlFor="sync-scroll"
                                className="text-sm cursor-pointer"
                              >
                                Sync Scroll
                              </Label>
                              <input
                                id="sync-scroll"
                                type="checkbox"
                                checked={syncScroll}
                                onChange={(e) =>
                                  setSyncScroll(e.target.checked)
                                }
                                className="cursor-pointer"
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <Label
                                htmlFor="show-unchanged"
                                className="text-sm cursor-pointer"
                              >
                                Show All
                              </Label>
                              <input
                                id="show-unchanged"
                                type="checkbox"
                                checked={showUnchanged}
                                onChange={(e) =>
                                  setShowUnchanged(e.target.checked)
                                }
                                className="cursor-pointer"
                              />
                            </div>
                          </div>
                        )}

                        {/* Side-by-side diff view */}
                        <div
                          id="split-container"
                          className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden min-h-64 bg-white dark:bg-gray-950 font-mono text-sm relative"
                        >
                          {(() => {
                            let originalLineNum = 1;
                            let modifiedLineNum = 1;

                            return filteredLineDiff.map((row, idx) => {
                              const choice = mergeChoices[row.index];

                              // Handle collapsible sections
                              if (
                                row.sectionStart &&
                                row.sectionSize &&
                                row.sectionSize > contextLines * 2
                              ) {
                                const isCollapsed = collapsedSections.has(
                                  row.index
                                );
                                const linesToShow = isCollapsed
                                  ? contextLines
                                  : row.sectionSize;

                                if (isCollapsed) {
                                  originalLineNum +=
                                    row.sectionSize - contextLines;
                                  modifiedLineNum +=
                                    row.sectionSize - contextLines;

                                  return (
                                    <div
                                      key={row.index}
                                      className="border-b border-gray-100 dark:border-gray-800"
                                    >
                                      <button
                                        onClick={() => toggleSection(row.index)}
                                        className="w-full py-2 px-4 text-center text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 flex items-center justify-center gap-2"
                                      >
                                        <ChevronDown className="h-4 w-4" />
                                        Expand {row.sectionSize -
                                          contextLines}{" "}
                                        unchanged lines
                                      </button>
                                    </div>
                                  );
                                } else if (
                                  idx === 0 ||
                                  filteredLineDiff[idx - contextLines]
                                    ?.index !==
                                    row.index - contextLines
                                ) {
                                  return (
                                    <div
                                      key={row.index}
                                      className="border-b border-gray-100 dark:border-gray-800"
                                    >
                                      <button
                                        onClick={() => toggleSection(row.index)}
                                        className="w-full py-2 px-4 text-center text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 flex items-center justify-center gap-2"
                                      >
                                        <ChevronUp className="h-4 w-4" />
                                        Collapse unchanged lines
                                      </button>
                                    </div>
                                  );
                                }
                              }

                              let originalBg = "bg-white dark:bg-gray-950";
                              let modifiedBg = "bg-white dark:bg-gray-950";
                              let originalContent = row.originalHtml;
                              let modifiedContent = row.modifiedHtml;

                              if (choice === "original") {
                                // Show the original line on both sides when original is chosen
                                originalBg = "bg-blue-100 dark:bg-blue-900/30";
                                modifiedBg = "bg-blue-100 dark:bg-blue-900/30";
                                // Use plain text without diff highlighting
                                const plainOriginal = escapeHtml(
                                  row.originalLine
                                );
                                originalContent = plainOriginal;
                                modifiedContent = plainOriginal;
                              } else if (choice === "modified") {
                                // Show the modified line on both sides when modified is chosen
                                originalBg = "bg-blue-100 dark:bg-blue-900/30";
                                modifiedBg = "bg-blue-100 dark:bg-blue-900/30";
                                // Use plain text without diff highlighting
                                const plainModified = escapeHtml(
                                  row.modifiedLine
                                );
                                originalContent = plainModified;
                                modifiedContent = plainModified;
                              } else if (row.type === "modified") {
                                originalBg = "bg-red-50 dark:bg-red-900/10";
                                modifiedBg = "bg-green-50 dark:bg-green-900/10";
                              } else if (row.type === "removed") {
                                originalBg = "bg-red-50 dark:bg-red-900/10";
                              } else if (row.type === "added") {
                                modifiedBg = "bg-green-50 dark:bg-green-900/10";
                              }

                              return (
                                <div
                                  key={row.index}
                                  className="flex border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                                  style={{
                                    display: "grid",
                                    gridTemplateColumns: `minmax(40px,auto) ${splitRatio}fr 2px minmax(40px,auto) ${
                                      100 - splitRatio
                                    }fr`,
                                  }}
                                >
                                  <div className="px-2 py-1 text-right text-gray-400 dark:text-gray-500 select-none border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                                    {row.originalLine !== ""
                                      ? originalLineNum++
                                      : ""}
                                  </div>
                                  <div
                                    ref={idx === 0 ? leftScrollRef : null}
                                    className={`whitespace-pre-wrap py-1 pl-2 pr-8 overflow-x-auto ${originalBg}`}
                                    dangerouslySetInnerHTML={{
                                      __html: originalContent,
                                    }}
                                  />
                                  <div
                                    className="relative bg-gray-300 dark:bg-gray-700 cursor-col-resize hover:bg-blue-500 dark:hover:bg-blue-500 transition-colors"
                                    onMouseDown={handleMouseDown}
                                  >
                                    {(row.type === "modified" ||
                                      row.type === "added" ||
                                      row.type === "removed") && (
                                      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center gap-1 z-10">
                                        {!choice ? (
                                          <>
                                            <Tooltip>
                                              <TooltipTrigger asChild>
                                                <button
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleMergeChoice(
                                                      row.index,
                                                      "original"
                                                    );
                                                  }}
                                                  className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900 rounded bg-white dark:bg-gray-800 shadow-sm"
                                                >
                                                  <ChevronLeft className="h-3.5 w-3.5" />
                                                </button>
                                              </TooltipTrigger>
                                              <TooltipContent>
                                                <p>Use original (left)</p>
                                              </TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                              <TooltipTrigger asChild>
                                                <button
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleMergeChoice(
                                                      row.index,
                                                      "modified"
                                                    );
                                                  }}
                                                  className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900 rounded bg-white dark:bg-gray-800 shadow-sm"
                                                >
                                                  <ChevronRight className="h-3.5 w-3.5" />
                                                </button>
                                              </TooltipTrigger>
                                              <TooltipContent>
                                                <p>Use modified (right)</p>
                                              </TooltipContent>
                                            </Tooltip>
                                          </>
                                        ) : (
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <button
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setMergeChoices((prev) => {
                                                    const newChoices = {
                                                      ...prev,
                                                    };
                                                    delete newChoices[
                                                      row.index
                                                    ];
                                                    return newChoices;
                                                  });
                                                }}
                                                className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900 rounded bg-blue-500 dark:bg-blue-600 text-white shadow-sm"
                                              >
                                                <X className="h-3.5 w-3.5" />
                                              </button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                              <p>Reset merge choice</p>
                                            </TooltipContent>
                                          </Tooltip>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                  <div className="px-2 py-1 text-right text-gray-400 dark:text-gray-500 select-none border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                                    {row.modifiedLine !== ""
                                      ? modifiedLineNum++
                                      : ""}
                                  </div>
                                  <div
                                    ref={idx === 0 ? rightScrollRef : null}
                                    className={`whitespace-pre-wrap py-1 pl-2 pr-2 overflow-x-auto ${modifiedBg}`}
                                    dangerouslySetInnerHTML={{
                                      __html: modifiedContent,
                                    }}
                                  />
                                </div>
                              );
                            });
                          })()}
                        </div>

                      </div>
                    </>
                  )}

                  <Card>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                          <Label
                            htmlFor="original-text"
                            className="text-base font-medium leading-normal"
                          >
                            Original Text
                          </Label>
                          <Textarea
                            id="original-text"
                            placeholder="Paste the original text here."
                            className="h-64 font-mono"
                            value={originalText}
                            onChange={(e) => setOriginalText(e.target.value)}
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <Label
                            htmlFor="modified-text"
                            className="text-base font-medium leading-normal"
                          >
                            Modified Text
                          </Label>
                          <Textarea
                            id="modified-text"
                            placeholder="Paste the modified text here."
                            className="h-64 font-mono"
                            value={modifiedText}
                            onChange={(e) => setModifiedText(e.target.value)}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex flex-col items-center justify-center gap-6 pt-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={() => runDiff()}
                          className="w-full sm:w-auto"
                          disabled={!originalText || !modifiedText}
                        >
                          Run Diff
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Compare the original and modified text (Ctrl/Cmd +
                          Enter)
                        </p>
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
