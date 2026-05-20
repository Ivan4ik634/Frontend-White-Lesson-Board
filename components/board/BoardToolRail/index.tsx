'use client';

import { GeoShapeGeoStyle, useEditor, useValue } from '@tldraw/editor';
import {
  ArrowUpRight,
  Circle,
  Eraser,
  Focus,
  Hand,
  LayoutDashboard,
  MousePointer2,
  Pencil,
  Redo2,
  Square,
  StickyNote,
  Type,
  Undo2,
  Waypoints,
} from 'lucide-react';
import { useCanRedo, useCanUndo } from 'tldraw';

import { colors } from '@/configs/colors';
import { useBoardCursors } from '@/hooks/useBoardCursors';
import { useBoardObjectsSync } from '@/hooks/useBoardObject/useBoard';
import { useProfile } from '@/hooks/useProfile';
import { cn } from '@/lib/utils';
import { ObjectT } from '@/types/ObjectBoard';
import { useEffect, useState } from 'react';
import { ToolButton } from './ToolButton';

interface BoardToolRailProps {
  objects: ObjectT[];
}
export function BoardToolRail({ objects }: BoardToolRailProps) {
  const editor = useEditor();
  const currentTool = useValue('board-current-tool', () => editor.getCurrentToolId(), [editor]);
  const nextGeo = useValue('board-next-geo', () => editor.getStyleForNextShape(GeoShapeGeoStyle), [
    editor,
  ]);
  const { profile } = useProfile();
  useBoardObjectsSync(objects);
  const { positions } = useBoardCursors();

  const canUndo = useCanUndo();
  const canRedo = useCanRedo();
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    return editor.store.listen(({ changes }) => {
      Object.values(changes.updated).forEach(([, to]) => {
        if (to.typeName === 'camera') {
          forceUpdate((p) => p + 1);
        }
      });
    });
  }, [editor]);

  const activateGeo = (geo: 'rectangle' | 'ellipse') => {
    editor.run(() => {
      editor.setStyleForNextShapes(GeoShapeGeoStyle, geo);
      editor.setCurrentTool('geo');
    });
    console.log(editor.getCurrentPageShapes());
  };
  console.log(positions);
  return (
    <>
      <div
        className={cn(
          'pointer-events-auto absolute top-1/2 left-3 z-60 flex -translate-y-1/2 flex-col gap-0.5 rounded-xl border border-border bg-background/92 p-1.5 shadow-sm backdrop-blur-md',
        )}>
        <ToolButton
          label="Select (V)"
          isActive={currentTool === 'select'}
          onClick={() => editor.setCurrentTool('select')}>
          <MousePointer2 className="size-4" />
        </ToolButton>
        <ToolButton
          label="Hand / pan (H)"
          isActive={currentTool === 'hand'}
          onClick={() => editor.setCurrentTool('hand')}>
          <Hand className="size-4" />
        </ToolButton>

        <div className="bg-border mx-auto my-0.5 h-px w-7" />

        <ToolButton
          label="Draw (D)"
          isActive={currentTool === 'draw'}
          onClick={() => editor.setCurrentTool('draw')}>
          <Pencil className="size-4" />
        </ToolButton>
        <ToolButton
          label="Eraser (E)"
          isActive={currentTool === 'eraser'}
          onClick={() => editor.setCurrentTool('eraser')}>
          <Eraser className="size-4" />
        </ToolButton>
        <ToolButton
          label="Text (T)"
          isActive={currentTool === 'text'}
          onClick={() => editor.setCurrentTool('text')}>
          <Type className="size-4" />
        </ToolButton>

        <div className="bg-border mx-auto my-0.5 h-px w-7" />

        <ToolButton
          label="Rectangle (Geo)"
          isActive={currentTool === 'geo' && nextGeo === 'rectangle'}
          onClick={() => activateGeo('rectangle')}>
          <Square className="size-4" />
        </ToolButton>
        <ToolButton
          label="Ellipse (Geo)"
          isActive={currentTool === 'geo' && nextGeo === 'ellipse'}
          onClick={() => activateGeo('ellipse')}>
          <Circle className="size-4" />
        </ToolButton>
        <ToolButton
          label="Arrow (A)"
          isActive={currentTool === 'arrow'}
          onClick={() => editor.setCurrentTool('arrow')}>
          <ArrowUpRight className="size-4" />
        </ToolButton>
        <ToolButton
          label="Line (L)"
          isActive={currentTool === 'line'}
          onClick={() => editor.setCurrentTool('line')}>
          <Waypoints className="size-4" />
        </ToolButton>
        <ToolButton
          label="Frame (F)"
          isActive={currentTool === 'frame'}
          onClick={() => editor.setCurrentTool('frame')}>
          <LayoutDashboard className="size-4" />
        </ToolButton>
        <ToolButton
          label="Sticky note"
          isActive={currentTool === 'note'}
          onClick={() => editor.setCurrentTool('note')}>
          <StickyNote className="size-4" />
        </ToolButton>

        <div className="bg-border mx-auto my-0.5 h-px w-7" />

        <ToolButton label="Undo" disabled={!canUndo} onClick={() => editor.undo()}>
          <Undo2 className="size-4" />
        </ToolButton>
        <ToolButton label="Redo" disabled={!canRedo} onClick={() => editor.redo()}>
          <Redo2 className="size-4" />
        </ToolButton>
        <ToolButton
          label="Zoom to fit"
          onClick={() => editor.zoomToFit({ animation: { duration: 220 } })}>
          <Focus className="size-4" />
        </ToolButton>
      </div>
      {positions
        ? positions.map((pos, i) => {
            const myPosition = positions.find((p) => p.user_id.id === profile?.id);
            const screenPoint = editor.pageToScreen({
              x: pos.x,
              y: pos.y,
            });
            return (
              pos.user_id.id !== profile?.id && (
                <div
                  key={pos.user_id.id}
                  style={{
                    left: screenPoint.x - myPosition!.x,
                    top: screenPoint.y - myPosition!.y,
                  }}
                  className="absolute z-20 flex -translate-x-1/2 -translate-y-1/2 items-center gap-x-2">
                  <MousePointer2 style={{ color: colors[i].value }} />
                  <div
                    style={{ backgroundColor: colors[i].value }}
                    className="p-2 text-sm rounded-[5px]">
                    {pos.user_id.name}
                  </div>
                </div>
              )
            );
          })
        : null}
    </>
  );
}
