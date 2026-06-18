'use client';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { colors } from '@/configs/colors';
import { useUploadImage } from '@/hooks/useUploadImage';
import { cn } from '@/lib/utils';
import { ElementT, EventsCanvas } from '@/types/Element';
import { UserT } from '@/types/UserT';
import { getCanvasCenter } from '@/utils/canvas';
import { Circle, Eraser, Hand, Image, MousePointer2, Pen, Square, Type } from 'lucide-react';
import { useEffect } from 'react';
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
  | 'arrow'
  | 'line';

type BoardToolRailProps = {
  activeTool: BoardTool;
  onToolChange: (tool: BoardTool) => void;
  color: string;
  profile: UserT | null;
  ref: React.RefObject<HTMLDivElement | null>;
  zoom: number;
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
  { value: 'text', label: 'Text', icon: Type },
  { value: 'image', label: 'Image', icon: Image },
  { value: 'pen', label: 'Pen', icon: Pen },
] satisfies Array<{
  value: BoardTool;
  label: string;
  icon: typeof Hand;
}>;

export function BoardToolRail({
  activeTool,
  profile,
  color,
  ref: canvasRef,
  zoom,
  camera,

  setColor,
  setElements,
  onToolChange,
  events,
}: BoardToolRailProps) {
  const { ref, url, setUrl, handleUploadImage, handleDeleteImage } = useUploadImage(profile);
  useEffect(() => {
    const createImageElement = async () => {
      if (url) {
        console.log(canvasRef.current?.getBoundingClientRect());
        const center = getCanvasCenter({ zoom, camera, canvasRef });

        console.log({
          center,
          camera,
          zoom,
          rect: canvasRef.current?.getBoundingClientRect(),
        });
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
        await events.handleCreateElement(element);
      }
    };
    createImageElement();
  }, [url]);
  return (
    <div
      className="absolute bottom-3 items-center left-1/2 z-10 flex -translate-x-1/2 gap-1 rounded-lg border border-border bg-background/95 p-1 shadow-sm backdrop-blur sm:left-3 sm:top-1/2 sm:bottom-auto sm:-translate-x-0 sm:-translate-y-1/2 sm:flex-col"
      aria-label="Board tools"
      onPointerDown={(event) => event.stopPropagation()}
      onPointerMove={(event) => event.stopPropagation()}
      onPointerUp={(event) => event.stopPropagation()}>
      {tools.map(({ value, label, icon: Icon }) => {
        if (value === 'image') {
          return (
            <div key={value} className="relative">
              <input
                ref={ref}
                type="file"
                accept="image/*"
                onChange={handleUploadImage}
                className="hidden"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={label}
                title={label}
                onClick={async (e) => ref.current?.click()}
                className={cn(
                  'size-8 rounded-md text-muted-foreground hover:text-foreground sm:size-10',
                  activeTool === value && 'text-foreground shadow-xs',
                )}>
                <Icon className="size-4" aria-hidden />
              </Button>
            </div>
          );
        }
        return (
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
        );
      })}
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
