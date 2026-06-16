'use client';

import { Canvas } from '@/components/board/canvas';
import { ElementT, EventsCanvas } from '@/types/Element';
import { useMemo, useState } from 'react';

export function LandingCanvasPreview() {
  const [elements, setElements] = useState<ElementT[]>([]);

  const events = useMemo<EventsCanvas>(
    () => ({
      handleCreateElement: () => undefined,
      handleUpdateElement: () => undefined,
      handleDeleteElement: () => undefined,
    }),
    [],
  );

  return (
    <div className="relative mx-auto mt-12 w-full max-w-6xl">
      <div className="h-[420px] overflow-hidden rounded-md  md:h-[520px]">
        <Canvas
          mode="demo"
          boardId=""
          initData={elements}
          setElements={setElements}
          events={events}
        />
      </div>
    </div>
  );
}
