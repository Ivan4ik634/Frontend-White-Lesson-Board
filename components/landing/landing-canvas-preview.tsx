'use client';

import { Canvas } from '@/components/board/canvas';
import { ElementT, EventsCanvas } from '@/types/Element';
import { useMemo, useState } from 'react';

export function LandingCanvasPreview() {
  const [elements, setElements] = useState<ElementT[]>([]);

  const events = useMemo<EventsCanvas>(
    () => ({
      handleCreateElement: async () => undefined,
      handleCreateElements: async () => undefined,
      handleUpdateElement: async () => undefined,
      handleDeleteElement: async () => undefined,
      handleDeleteElements: async () => undefined,
      handleReplaceBoard: async () => undefined,
    }),
    [],
  );

  return (
    <div className="relative mx-auto mt-12 w-full max-w-6xl">
      <div className="h-[420px] overflow-hidden rounded-md  md:h-[520px]">
        <Canvas
          mode="demo"
          boardId=""
          profile={null}
          initData={elements}
          setElements={setElements}
          events={events}
        />
      </div>
    </div>
  );
}
