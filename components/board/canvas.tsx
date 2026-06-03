'use client';

import { useCanvasCamera } from '@/hooks/useCanvas/useCanvasCamera';
import { useCanvasCopied } from '@/hooks/useCanvas/useCanvasCopied';
import { useCanvasDrop } from '@/hooks/useCanvas/useCanvasDrop';
import { useCanvasElement } from '@/hooks/useCanvas/useCanvasElement';
import { useCanvasEraser } from '@/hooks/useCanvas/useCanvasEraser';
import { useCanvasPen } from '@/hooks/useCanvas/useCanvasPen';
import { useCanvasResize } from '@/hooks/useCanvas/useCanvasResize';
import { useCanvasSelection } from '@/hooks/useCanvas/useCanvasSelection';
import { useCanvasTrigger } from '@/hooks/useCanvas/useCanvasTrigger';
import { CursorsCanvas, ElementT, EventsCanvas } from '@/types/Element';
import { UserT } from '@/types/UserT';
import { useRef, useState } from 'react';
import { BoardTool, BoardToolRail } from './BoardToolRail';
import CanvasCursors from './CanvasCursors';
import CanvasElements from './CanvasElements';
import CanvasSelection from './CanvasSelection';

type BoardCanvasProps = {
  events: EventsCanvas;
  initData: ElementT[];
  setElements: React.Dispatch<React.SetStateAction<ElementT[]>>;
  cursors?: CursorsCanvas[];
  onCursorMove?: (point: { x: number; y: number }) => void;
  profile?: UserT | null;
};

export function Canvas({
  events,
  cursors = [],
  onCursorMove,
  profile = null,
  setElements,
  initData,
}: BoardCanvasProps) {
  const [tool, setTool] = useState<BoardTool>('grab');
  const canvasRef = useRef<HTMLDivElement | null>(null);

  const { camera, ref, handleCaremaStart, handleZoom, zoom, handleCameraMove, handleCameraEnd } =
    useCanvasCamera(tool);

  const {
    elements,
    inputRef,
    handleElementStart,
    handleElementMove,
    editingId,
    draft,
    startEditing,
    finishEditing,
    getEditingElement,
    setDraft,
    handleTextStart,
    handleElementEnd,
  } = useCanvasElement({
    elements: initData,
    setElements,
    canvasRef,
    events,
    zoom,
    setTool,
    tool,
  });

  const {
    handleSelectionEnd,
    handleSelectionMove,
    handleSelectionStart,
    selection,
    isSelectionRef,
    setSelectedElementIds,
    selectedElementIds,
  } = useCanvasSelection({
    canvasRef,
    zoom,
    events,
    setElements,
    elements,
  });

  const { handlePenStart, handlePenMove, handlePenEnd } = useCanvasPen({
    zoom,
    elements: initData,
    events,
    tool,
    canvasRef,
    setElements,
  });

  const { handleResizeStart, handleResizeEnd, handleResizeMove, resizeRef } = useCanvasResize({
    elements,
    zoom,
    events,
    setElements,
    canvasRef,
  });
  useCanvasCopied({ elements, events, setElements, setSelectedElementIds, selectedElementIds });

  const {
    handleUpdateObjectDown,
    handleUpdateObjectMove,
    handleUpdateObjectUp,
    selectedElementMove,
  } = useCanvasDrop({
    elements,
    setElements,
    canvasRef,
    setSelectedElementIds,
    events,
    zoom,
    resizeRef,
  });
  const { handleEraserStart, handleEraserMove, handleEraserEnd } = useCanvasEraser({
    zoom,
    elements,
    setElements,
    canvasRef,
    events,
    tool,
  });

  const { handleCanvasTriggerStart, handleCanvasTriggerMove, handleCanvasTriggerEnd } =
    useCanvasTrigger({
      tool,
      handleSelectionStart,
      handleEraserStart,
      handleEraserMove,
      handleEraserEnd,
      handleSelectionMove,
      handleSelectionEnd,
      handleUpdateObjectDown,
      handleUpdateObjectMove,
      handleUpdateObjectUp,
      handlePenStart,
      handlePenMove,
      handlePenEnd,
      handleCaremaStart,
      handleCameraMove,
      handleCameraEnd,
      handleElementStart,
      handleElementMove,
      handleElementEnd,
      handleResizeMove,
      handleResizeEnd,
    });
  const editingEl = getEditingElement();

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const canvas = canvasRef.current;

    if (canvas && onCursorMove) {
      const rect = canvas.getBoundingClientRect();

      onCursorMove({
        x: (e.clientX - rect.left) / zoom,
        y: (e.clientY - rect.top) / zoom,
      });
    }

    handleCanvasTriggerMove(e);
  };

  return (
    <div
      ref={ref}
      style={{
        backgroundSize: `${40 * zoom}px ${40 * zoom}px`,
        backgroundImage: `
      linear-gradient(to right, #ddd 1px, transparent 1px),
      linear-gradient(to bottom, #ddd 1px, transparent 1px)
    `,
        backgroundPosition: `${camera.x}px ${camera.y}px`,
      }}
      onWheel={handleZoom}
      onPointerDown={(e) => {
        if (tool === 'text') {
          handleTextStart(e);
          return;
        }

        handleCanvasTriggerStart(e);
      }}
      onPointerMove={handlePointerMove}
      onPointerUp={handleCanvasTriggerEnd}
      onPointerCancel={handleCanvasTriggerEnd}
      className="relative h-full w-full touch-none overflow-hidden rounded-lg border border-border bg-background shadow-sm sm:rounded-xl">
      <BoardToolRail activeTool={tool} onToolChange={setTool} />

      <div
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          transform: `translate(${camera.x}px, ${camera.y}px) scale(${zoom})`,
          transformOrigin: '0 0',
        }}>
        <CanvasElements
          handleResizeStart={handleResizeStart}
          selectedElementMove={selectedElementMove}
          selectedElementIds={selectedElementIds}
          elements={elements}
          editingId={editingId}
          startEditing={startEditing}
        />
        <CanvasSelection isSelectionRef={isSelectionRef} selection={selection} />
        <CanvasCursors profile={profile} cursors={cursors} zoom={zoom} />
        {editingId && (
          <textarea
            ref={inputRef}
            value={draft}
            onChange={async (e) => {
              setDraft(e.target.value);
              if (editingEl && editingEl?.type === 'text')
                await events.handleUpdateElement({ ...editingEl!, text: e.target.value });
            }}
            onBlur={finishEditing}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                finishEditing();
              }
            }}
            className="absolute  bg-transparent outline-none resize-none border-none p-0 m-0 overflow-hidden"
            style={{
              position: 'absolute',
              left: editingEl?.type === 'text' ? editingEl?.x : 0,
              top: editingEl?.type === 'text' ? editingEl?.y : 0,
              width: `${Math.max(draft.length * 10, 20)}px`,
              minHeight: 50,

              transformOrigin: 'top left',

              background: 'transparent',
              border: 'none',
              outline: 'none',
              resize: 'none',
            }}
          />
        )}
      </div>
    </div>
  );
}
