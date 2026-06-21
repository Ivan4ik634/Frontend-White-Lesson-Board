import { BoardTool } from '@/components/board/BoardToolRail';
import { useHistoryStore } from '@/store/useHistoryStore';
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
  color: string;
}
export const useCanvasElementText = ({
  zoom,
  tool,
  setElements,
  color,

  elements,
  canvasRef,
  events,
}: Props) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { setHistory } = useHistoryStore();

  const handleTextStart = async (e: PointerEvent<HTMLDivElement>) => {
    if (tool !== 'text') return;
    const { x, y } = getWorld({ e, zoom, canvasRef });

    const id = crypto.randomUUID();

    const element: ElementT = {
      id,
      type: 'text',
      x,
      y,
      color,
      width: 120,
      height: 32,
      fontSize: 16,
      text: '',
    };

    setElements((prev) => {
      const next = [...prev, element];
      return next;
    });

    setEditingId(id);
    setDraft('');

    events.handleCreateElement(element);

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

  const finishingRef = useRef(false);

  const finishEditing = async () => {
    if (finishingRef.current) return;
    finishingRef.current = true;

    const current = elements.find((el) => el.id === editingId);
    if (!current || current.type !== 'text') {
      finishingRef.current = false;
      return;
    }

    const value = draft;

    const next = elements.map((el) => (el.id === editingId ? { ...el, text: value } : el));

    setElements(next);

    setHistory(next);

    setEditingId(null);
    setDraft('');

    try {
      await events.handleUpdateElement({
        ...current,
        text: value,
      });
    } finally {
      finishingRef.current = false;
    }
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
