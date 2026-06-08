import { BoardTool } from '@/components/board/BoardToolRail';
import { ElementT, EventsCanvas } from '@/types/Element';
import { RefObject, useEffect } from 'react';
import { useCanvasElementObject } from './useCanvasElementObject';
import { useCanvasElementText } from './useCanvasElementText';

interface Props {
  zoom: number;
  tool: BoardTool;
  setTool: React.Dispatch<React.SetStateAction<BoardTool>>;
  canvasRef: RefObject<HTMLDivElement | null>;
  events: EventsCanvas;
  elements: ElementT[];
  setElements: React.Dispatch<React.SetStateAction<ElementT[]>>;
  color: string;
}

export const useCanvasElement = ({
  setElements,
  elements,
  events,
  zoom,
  color,
  tool,
  canvasRef,
}: Props) => {
  useEffect(() => {
    console.log(elements);
    if (elements) setElements(elements);
  }, [elements]);
  const { handleElementStart, handleElementMove, handleElementEnd } = useCanvasElementObject({
    canvasRef,
    zoom,
    tool,
    color,
    events,
    setElements,
  });
  const {
    handleTextStart,
    startEditing,
    finishEditing,
    editingId,
    draft,
    setDraft,
    inputRef,
    getEditingElement,
  } = useCanvasElementText({ zoom, color, events, canvasRef, tool, setElements, elements });

  return {
    editingId,
    draft,
    elements,
    setElements,
    inputRef,
    handleElementStart,
    handleElementMove,
    handleElementEnd,
    handleTextStart,
    startEditing,
    finishEditing,
    setDraft,
    getEditingElement,
  };
};
