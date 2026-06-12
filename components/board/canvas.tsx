'use client';

import { useBoardCursors } from '@/hooks/useBoardCursors';
import { useCanvasCamera } from '@/hooks/useCanvas/useCanvasCamera';
import { useCanvasCopied } from '@/hooks/useCanvas/useCanvasCopied';
import { useCanvasDrop } from '@/hooks/useCanvas/useCanvasDrop';
import { useCanvasElement } from '@/hooks/useCanvas/useCanvasElement';
import { useCanvasEraser } from '@/hooks/useCanvas/useCanvasEraser';
import { useCanvasPen } from '@/hooks/useCanvas/useCanvasPen';
import { useCanvasResize } from '@/hooks/useCanvas/useCanvasResize';
import { useCanvasSelection } from '@/hooks/useCanvas/useCanvasSelection';
import { useCanvasTrigger } from '@/hooks/useCanvas/useCanvasTrigger';
import { ElementT, EventsCanvas } from '@/types/Element';
import { UserT } from '@/types/UserT';
import { useRef, useState } from 'react';
import { BoardTool, BoardToolRail } from './BoardToolRail';
import CanvasCursors from './CanvasCursors';
import CanvasElements from './CanvasElements';
import CanvasPickColors from './CanvasPickColors';
import CanvasSelection from './CanvasSelection';
import CanvasZoom from './CanvasZoom';

type BoardCanvasProps = {
  boardId: string;
  events: EventsCanvas;
  initData: ElementT[];
  cameraInit?: { x: number; y: number };
  setElements: React.Dispatch<React.SetStateAction<ElementT[]>>;
  profile?: UserT | null;
  mode: 'demo' | 'board';
};

export function Canvas({
  boardId,
  events,
  cameraInit,
  profile = null,
  setElements,
  mode,
  initData,
}: BoardCanvasProps) {
  const [tool, setTool] = useState<BoardTool>('grab');
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const [color, setColor] = useState('#111827');

  const {
    camera,
    ref,
    addZoom,
    handleCaremaStart,
    handleZoom,
    zoom,
    handleCameraMove,
    handleCameraEnd,
    handleTouchMove,
    handleTouchEnd,
  } = useCanvasCamera(tool, canvasRef, cameraInit);
  useBoardCursors({ boardId, mode, canvasRef, zoom });

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
    color,
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
    color,
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
  const { handleEraserStart, handleEraserMove, elementsIdsRemove, handleEraserEnd } =
    useCanvasEraser({
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

  return (
    <div
      ref={ref}
      style={{
        backgroundSize: `${40 * zoom}px ${40 * zoom}px`,
        backgroundPosition: `${camera.x}px ${camera.y}px`,
        backgroundImage: `
    radial-gradient(circle, rgba(120, 120, 120, 0.6) 1px, transparent 1px)
  `,
      }}
      onWheel={handleZoom}
      onPointerDown={(e) => {
        e.stopPropagation();
        if (tool === 'text') {
          handleTextStart(e);
          return;
        }

        handleCanvasTriggerStart(e);
      }}
      onPointerMove={handleCanvasTriggerMove}
      onPointerUp={handleCanvasTriggerEnd}
      onPointerCancel={handleCanvasTriggerEnd}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative h-full w-full touch-none overflow-hidden rounded-lg border border-border bg-background shadow-sm sm:rounded-xl">
      <BoardToolRail color={color} setColor={setColor} activeTool={tool} onToolChange={setTool} />
      <CanvasPickColors color={color} setColor={setColor} />
      <CanvasZoom addZoom={addZoom} zoom={zoom} />
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
          elementsIdsRemove={elementsIdsRemove}
          editingId={editingId}
          startEditing={startEditing}
        />
        <CanvasSelection isSelectionRef={isSelectionRef} selection={selection} />
        <CanvasCursors profile={profile} zoom={zoom} />

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
            className="absolute bg-transparent outline-none resize-none border-none p-0 m-0 overflow-hidden"
            style={{
              position: 'absolute',
              whiteSpace: 'nowrap',
              color: editingEl?.color,

              left: editingEl?.type === 'text' ? editingEl?.x : 0,
              top: editingEl?.type === 'text' ? editingEl?.y : 0,
              width: `${Math.max(draft.length * 15, 20)}px`,
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
