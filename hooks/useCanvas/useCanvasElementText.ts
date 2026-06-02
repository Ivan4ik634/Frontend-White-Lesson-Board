import { BoardTool } from '@/components/board/BoardToolRail';
import { ElementT, EventsCanvas } from '@/types/Element';
import { getWorld } from '@/utils/canvas';
import { PointerEvent, RefObject, useRef, useState } from 'react';

interface Props {
  zoom: number;
  tool: BoardTool;
  setElements: React.Dispatch<React.SetStateAction<ElementT[]>>;
  elements: ElementT[];
  canvasRef: RefObject<HTMLDivElement | null>;
  events: EventsCanvas;
}
export const useCanvasElementText = ({
  zoom,
  tool,
  setElements,
  elements,
  canvasRef,
  events,
}: Props) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const handleTextStart = async (e: PointerEvent<HTMLDivElement>) => {
    if (tool !== 'text') return;
    const { x, y } = getWorld({ e, zoom, canvasRef });

    const id = crypto.randomUUID();

    const element: ElementT = {
      id,
      type: 'text',
      x,
      y,
      text: '',
    };

    setElements((prev) => [...prev, element]);

    setEditingId(id);
    setDraft('');

    await events.handleCreateElement(element);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const startEditing = (id: string) => {
    const el = elements.find((e) => e.id === id);
    if (!el) return;

    setEditingId(id);
    setDraft(el.type === 'text' ? el.text : '');

    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const finishEditing = async () => {
    const current = elements.find((el) => el.id === editingId);

    if (!current || !(current.type === 'text')) return;

    setElements((prev) => prev.map((el) => (el.id === editingId ? { ...el, text: draft } : el)));

    await events.handleUpdateElement({ ...current, text: draft });
    setEditingId(null);
    setDraft('');
  };

  const getEditingElement = () => elements.find((e) => e.id === editingId);

  return {
    handleTextStart,
    startEditing,
    finishEditing,
    editingId,
    draft,
    setDraft,
    inputRef,
    getEditingElement,
  };
};
