'use client';

import { Button, buttonVariants } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { colors } from '@/configs/colors';
import { useUploadImage } from '@/hooks/useUploadImage';
import { cn } from '@/lib/utils';
import { useHistoryStore } from '@/store/useHistoryStore';
import { useOpenAiChat } from '@/store/useOpenAiChat';
import { ElementT, EventsCanvas } from '@/types/Element';
import { UserT } from '@/types/UserT';
import { getCanvasCenter } from '@/utils/canvas';
import {
  Circle,
  Eraser,
  Hand,
  Image,
  LineSquiggle,
  Menu,
  MousePointer2,
  Pen,
  Sparkles,
  Square,
  Type,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { IoIosColorFilter } from 'react-icons/io';

export type BoardTool =
  | 'grab'
  | 'rectangle'
  | 'circle'
  | 'text'
  | 'pen'
  | 'cursor'
  | 'eraser'
  | 'image'
  | 'line';

type BoardToolRailProps = {
  activeTool: BoardTool;
  onToolChange: (tool: BoardTool) => void;
  color: string;
  profile: UserT | null;
  ref: React.RefObject<HTMLDivElement | null>;
  zoom: number;
  boardId: string;
  camera: { x: number; y: number };
  events: EventsCanvas;
  setColor: React.Dispatch<React.SetStateAction<string>>;
  setElements: React.Dispatch<React.SetStateAction<ElementT[]>>;
};

const tools = [
  { value: 'cursor', label: 'Cursor', icon: MousePointer2 },
  { value: 'grab', label: 'Grab', icon: Hand },
  { value: 'eraser', label: 'Eraser', icon: Eraser },
  { value: 'rectangle', label: 'Rectangle', icon: Square },
  { value: 'circle', label: 'Circle', icon: Circle },
  { value: 'line', label: 'Line', icon: LineSquiggle },
  { value: 'text', label: 'Text', icon: Type },
  { value: 'image', label: 'Image', icon: Image },
  { value: 'pen', label: 'Pen', icon: Pen },
] satisfies Array<{
  value: BoardTool;
  label: string;
  icon: typeof Hand;
}>;

const mobilePopoverToolValues = ['circle', 'line', 'image'];
const mobilePopoverTools = tools.filter((tool) => mobilePopoverToolValues.includes(tool.value));
const mobileVisibleTools = tools.filter((tool) => !mobilePopoverToolValues.includes(tool.value));

export function BoardToolRail({
  activeTool,
  profile,
  boardId,
  color,
  ref: canvasRef,
  zoom,
  camera,
  setColor,
  setElements,
  onToolChange,
  events,
}: BoardToolRailProps) {
  const { open, setOpen } = useOpenAiChat();
  const { ref, url, handleUploadImage } = useUploadImage(profile);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isColorsOpen, setIsColorsOpen] = useState(false);
  const activePopoverTool = mobilePopoverTools.find((tool) => tool.value === activeTool);
  const ActivePopoverToolIcon = activePopoverTool?.icon ?? Menu;
  const { push } = useHistoryStore();
  const selectTool = (tool: BoardTool) => {
    onToolChange(tool);
    setIsToolsOpen(false);
  };

  const openImagePicker = () => {
    ref.current?.click();
    setIsToolsOpen(false);
  };

  useEffect(() => {
    const createImageElement = async () => {
      if (url) {
        const center = getCanvasCenter({ zoom, camera, canvasRef });

        const element: ElementT = {
          id: crypto.randomUUID(),
          type: 'image',
          x: center.x - 50,
          y: center.y - 50,
          width: 100,
          height: 100,
          color: '',
          file: url ?? '',
        };
        setElements((prev) => [...prev, element]);
        push({ type: 'CREATE', element });

        await events.handleCreateElement(element);
      }
    };
    createImageElement();
  }, [url]);
  return (
    <div
      className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-lg border border-border bg-background/95 p-1 shadow-sm backdrop-blur sm:left-3 sm:top-1/2 sm:bottom-auto sm:-translate-x-0 sm:-translate-y-1/2 sm:flex-col"
      aria-label="Board tools"
      onPointerDown={(event) => event.stopPropagation()}
      onPointerMove={(event) => event.stopPropagation()}
      onPointerUp={(event) => event.stopPropagation()}>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        onChange={handleUploadImage}
        className="hidden"
      />

      <div className="hidden items-center gap-1 sm:flex sm:flex-col">
        {tools.map(({ value, label, icon: Icon }) => (
          <Button
            key={value}
            type="button"
            variant={activeTool === value ? 'secondary' : 'ghost'}
            size="icon"
            aria-label={label}
            aria-pressed={activeTool === value}
            title={label}
            onClick={value === 'image' ? openImagePicker : () => selectTool(value)}
            className={cn(
              'size-8 rounded-md text-muted-foreground hover:text-foreground sm:size-10',
              activeTool === value && 'text-foreground shadow-xs',
            )}>
            <Icon className="size-4" aria-hidden />
          </Button>
        ))}
      </div>

      <div className="flex items-center gap-1 sm:hidden">
        {mobileVisibleTools.map(({ value, label, icon: Icon }) => (
          <Button
            key={value}
            type="button"
            variant={activeTool === value ? 'secondary' : 'ghost'}
            size="icon"
            aria-label={label}
            aria-pressed={activeTool === value}
            title={label}
            onClick={() => selectTool(value)}
            className={cn(
              'size-9 rounded-md text-muted-foreground hover:text-foreground',
              activeTool === value && 'text-foreground shadow-xs',
            )}>
            <Icon className="size-4" aria-hidden />
          </Button>
        ))}

        <Popover open={isToolsOpen} onOpenChange={setIsToolsOpen}>
          <PopoverTrigger
            type="button"
            aria-label="Tools"
            title="Tools"
            className={cn(
              buttonVariants({ variant: 'secondary', size: 'icon' }),
              'size-9 gap-0.5 rounded-md text-foreground',
            )}>
            <ActivePopoverToolIcon className="size-4" aria-hidden />
          </PopoverTrigger>
          <PopoverContent side="top" align="center" className="w-auto p-1.5">
            <div className="grid grid-cols-3 gap-1">
              {mobilePopoverTools.map(({ value, label, icon: Icon }) => (
                <Button
                  key={value}
                  type="button"
                  variant={activeTool === value ? 'secondary' : 'ghost'}
                  size="icon"
                  aria-label={label}
                  aria-pressed={activeTool === value}
                  title={label}
                  onClick={value === 'image' ? openImagePicker : () => selectTool(value)}
                  className={cn(
                    'size-10 rounded-md text-muted-foreground hover:text-foreground',
                    activeTool === value && 'text-foreground shadow-xs',
                  )}>
                  <Icon className="size-4" aria-hidden />
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {boardId && (
        <Button
          type="button"
          variant={open ? 'secondary' : 'ghost'}
          size="icon"
          aria-label={'Ai chat'}
          aria-pressed={open}
          title={'Ai chat'}
          onClick={() => setOpen(!open)}
          className={cn(
            'size-8 rounded-md text-muted-foreground hover:text-foreground sm:size-10',
            open && 'text-foreground shadow-xs',
          )}>
          <Sparkles className="size-4" aria-hidden />
        </Button>
      )}
      <div className="ml-1 sm:hidden">
        <Popover open={isColorsOpen} onOpenChange={setIsColorsOpen}>
          <PopoverTrigger
            type="button"
            aria-label="Colors"
            title="Colors"
            className={cn(
              buttonVariants({ variant: 'secondary', size: 'icon' }),
              'size-9 rounded-md text-muted-foreground hover:text-foreground',
            )}>
            <IoIosColorFilter className="size-4" aria-hidden />
          </PopoverTrigger>
          <PopoverContent side="top" align="center" className="w-auto flex-col bg-stone-200 p-2">
            {colors.map((c, i) => (
              <div
                key={i}
                className={`flex justify-center rounded-[5px] p-2 ${c.value === color ? 'bg-black/10' : ''}`}>
                <div
                  onClick={() => {
                    setColor(c.value);
                    setIsColorsOpen(false);
                  }}
                  style={{ backgroundColor: c.value }}
                  className="h-6 w-6 cursor-pointer rounded-full"
                />
              </div>
            ))}
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
