import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { forwardRef } from 'react';
import type { ButtonProps } from '@/components/ui/button';

interface TooltipButtonProps extends ButtonProps {
  tooltip: string;
  tooltipSide?: 'top' | 'right' | 'bottom' | 'left';
}

export const TooltipButton = forwardRef<HTMLButtonElement, TooltipButtonProps>(
  ({ tooltip, tooltipSide = 'top', children, ...buttonProps }, ref) => {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button ref={ref} {...buttonProps}>
            {children}
          </Button>
        </TooltipTrigger>
        <TooltipContent side={tooltipSide}>
          <p className="text-xs">{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    );
  }
);

TooltipButton.displayName = 'TooltipButton';
