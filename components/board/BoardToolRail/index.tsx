'use client';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { colors } from '@/configs/colors';
import { cn } from '@/lib/utils';
import { Circle, Eraser, Hand, MousePointer2, Pen, Square, Type } from 'lucide-react';
import { IoIosColorFilter } from 'react-icons/io';

export type BoardTool = 'grab' | 'rectangle' | 'circle' | 'text' | 'pen' | 'cursor' | 'eraser';

type BoardToolRailProps = {
  activeTool: BoardTool;
  onToolChange: (tool: BoardTool) => void;
  color: string;

  setColor: React.Dispatch<React.SetStateAction<string>>;
};

const tools = [
  { value: 'cursor', label: 'Cursor', icon: MousePointer2 },
  { value: 'grab', label: 'Grab', icon: Hand },
  { value: 'eraser', label: 'Eraser', icon: Eraser },
  { value: 'rectangle', label: 'Rectangle', icon: Square },
  { value: 'circle', label: 'Circle', icon: Circle },
  { value: 'text', label: 'Text', icon: Type },
  { value: 'pen', label: 'Pen', icon: Pen },
] satisfies Array<{
  value: BoardTool;
  label: string;
  icon: typeof Hand;
}>;

export function BoardToolRail({ activeTool, color, setColor, onToolChange }: BoardToolRailProps) {
  return (
    <div
      className="absolute bottom-3 items-center left-1/2 z-10 flex -translate-x-1/2 gap-1 rounded-lg border border-border bg-background/95 p-1 shadow-sm backdrop-blur sm:left-3 sm:top-1/2 sm:bottom-auto sm:-translate-x-0 sm:-translate-y-1/2 sm:flex-col"
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
            'size-8 rounded-md text-muted-foreground hover:text-foreground sm:size-10',
            activeTool === value && 'text-foreground shadow-xs',
          )}>
          <Icon className="size-4" aria-hidden />
        </Button>
      ))}
      <div className="sm:hidden ml-3">
        <Popover>
          <PopoverTrigger>
            <Button
              asChild
              className={'size-8 rounded-md text-muted-foreground hover:text-foreground sm:size-10'}
              variant="secondary">
              <IoIosColorFilter className="size-4" aria-hidden />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="bg-stone-200 w-auto flex-col p-2">
            {colors.map((c, i) => (
              <div
                key={i}
                className={`rounded-[5px] p-2 flex justify-center ${c.value === color ? 'bg-black/10' : ''}`}>
                <div
                  onClick={() => setColor(c.value)}
                  key={i}
                  style={{ backgroundColor: c.value }}
                  className="w-6 h-6 rounded-full cursor-pointer"
                />
              </div>
            ))}
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
