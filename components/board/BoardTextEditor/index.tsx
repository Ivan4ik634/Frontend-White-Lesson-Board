'use client';

import { ElementT, EventsCanvas } from '@/types/Element';
import { FC, RefObject } from 'react';

interface Props {
  inputRef: RefObject<HTMLTextAreaElement | null>;
  draft: string;
  setDraft: (value: string) => void;
  finishEditing: () => void;
  getEditingElement: () => ElementT | undefined;
  events: EventsCanvas;
}

const BoardTextEditor: FC<Props> = ({
  inputRef,
  draft,
  setDraft,
  finishEditing,
  getEditingElement,
  events,
}) => {
  const el = getEditingElement();

  const editingEl = el?.type === 'text' ? el : undefined;
  return (
    <textarea
      ref={inputRef}
      value={draft}
      onChange={(e) => {
        const value = e.target.value;
        setDraft(value);

        if (editingEl?.type === 'text') {
          events.handleUpdateElement({
            ...editingEl,
            text: value,
          });
        }
      }}
      onBlur={finishEditing}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          finishEditing();
        }
      }}
      className="absolute bg-transparent break-words outline-none resize-none border-none p-0 m-0 overflow-hidden"
      style={{
        position: 'absolute',
        color: editingEl?.color,

        left: editingEl?.x,
        top: editingEl?.y,
        width: `${editingEl?.width}px`,
        height: `${editingEl?.height}px`,

        fontSize: `${editingEl?.fontSize}px`,

        transformOrigin: 'top left',

        background: 'transparent',
        border: 'none',
        outline: 'none',
        resize: 'none',
      }}
    />
  );
};

export default BoardTextEditor;
