'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Circle, Hand, MousePointer2, Pen, Square, Type } from 'lucide-react';

export type BoardTool = 'grab' | 'rectangle' | 'circle' | 'text' | 'pen' | 'cursor';

type BoardToolRailProps = {
  activeTool: BoardTool;
  onToolChange: (tool: BoardTool) => void;
};

const tools = [
  { value: 'cursor', label: 'Cursor', icon: MousePointer2 },
  { value: 'grab', label: 'Grab', icon: Hand },
  { value: 'rectangle', label: 'Rectangle', icon: Square },
  { value: 'circle', label: 'Circle', icon: Circle },
  { value: 'text', label: 'Text', icon: Type },
  { value: 'pen', label: 'Pen', icon: Pen },
] satisfies Array<{
  value: BoardTool;
  label: string;
  icon: typeof Hand;
}>;

export function BoardToolRail({ activeTool, onToolChange }: BoardToolRailProps) {
  return (
    <div
      className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1 rounded-lg border border-border bg-background/95 p-1 shadow-sm backdrop-blur sm:left-3 sm:top-1/2 sm:bottom-auto sm:-translate-x-0 sm:-translate-y-1/2 sm:flex-col"
      aria-label="Board tools"
      onPointerDown={(event) => event.stopPropagation()}
      onPointerMove={(event) => event.stopPropagation()}
      onPointerUp={(event) => event.stopPropagation()}>
      {tools.map(({ value, label, icon: Icon }) => (
        <Button
          key={value}
          type="button"
          variant={activeTool === value ? 'secondary' : 'ghost'}
          size="icon"
          aria-label={label}
          aria-pressed={activeTool === value}
          title={label}
          onClick={() => onToolChange(value)}
          className={cn(
            'size-10 rounded-md text-muted-foreground hover:text-foreground sm:size-8',
            activeTool === value && 'text-foreground shadow-xs',
          )}>
          <Icon className="size-4" aria-hidden />
        </Button>
      ))}
    </div>
  );
}
