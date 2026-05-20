import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

type ToolButtonProps = {
  label: string;
  isActive?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
};

export function ToolButton({
  label,
  isActive = false,
  disabled = false,
  onClick,
  children,
}: ToolButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'text-muted-foreground hover:text-foreground size-9 shrink-0 rounded-lg',
        isActive && 'bg-muted text-foreground',
      )}>
      {children}
    </Button>
  );
}
