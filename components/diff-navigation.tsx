import { TooltipButton } from '@/components/tooltip-button';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface DiffNavigationProps {
  currentIndex: number;
  totalDiffs: number;
  onNext: () => void;
  onPrevious: () => void;
  className?: string;
}

export function DiffNavigation({
  currentIndex,
  totalDiffs,
  onNext,
  onPrevious,
  className = '',
}: DiffNavigationProps) {
  if (totalDiffs === 0) {
    return null;
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* <Badge variant="secondary" className="text-xs">
        {currentIndex + 1} of {totalDiffs}
      </Badge> */}
      <div className="flex items-center gap-1">
        <TooltipButton
          variant="outline"
          size="sm"
          onClick={onPrevious}
          disabled={currentIndex === 0}
          tooltip="Jump to previous difference (Shift+F7)"
          className="h-7 w-7 p-0"
        >
          <ChevronUp className="h-4 w-4" />
        </TooltipButton>
        <TooltipButton
          variant="outline"
          size="sm"
          onClick={onNext}
          disabled={currentIndex >= totalDiffs - 1}
          tooltip="Jump to next difference (F7)"
          className="h-7 w-7 p-0"
        >
          <ChevronDown className="h-4 w-4" />
        </TooltipButton>
      </div>
    </div>
  );
}
