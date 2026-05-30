'use client';

import { ElementT } from '@/types/Element';
import { FC, PointerEvent } from 'react';

interface Props {
  elements: ElementT[];
  editingId: string | null;
  startEditing: (id: string) => void;
  selectedElementIds: string[];
  selectedElementMove: string;
  handleResizeStart: (
    e: PointerEvent<HTMLDivElement>,
    corner: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right',
    id: string,
  ) => void;
}

const CanvasElements: FC<Props> = ({
  elements,
  selectedElementIds,
  selectedElementMove,
  editingId,
  startEditing,
  handleResizeStart,
}) => {
  return elements.map((el) => {
    if (el.type === 'text') {
      const isEditing = editingId === el.id;

      return (
        <div
          key={el.id}
          onDoubleClick={(e) => {
            e.stopPropagation();
            startEditing(el.id);
          }}
          className={`absolute no-select whitespace-pre ${selectedElementIds.includes(el.id) ? 'border-2 border-blue-500' : ''}`}
          style={{
            left: el.x,

            top: el.y,
            visibility: isEditing ? 'hidden' : 'visible',
          }}>
          {el.text}
        </div>
      );
    }

    return el.type === 'pen' ? (
      <svg key={el.id} className={` no-select absolute  overflow-visible pointer-events-none`}>
        <polyline
          points={el.points.map((p) => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke={`${selectedElementIds.includes(el.id) ? 'blue' : 'black'}`}
          strokeWidth={3}
        />
      </svg>
    ) : (
      <div key={el.id}>
        {selectedElementIds.includes(el.id) && (
          <div
            style={{
              position: 'absolute',
              left: el.x,
              width: el.width,
              height: el.height,
              top: el.y,
            }}
            className={`z-10 border-[1px] border-blue-500`}>
            <div className="relative w-full h-full">
              <div
                onPointerDown={(e) => handleResizeStart(e, 'top-left', el.id)}
                className="absolute -left-1.5 -top-1.5 z-100 size-3 touch-none cursor-nwse-resize rounded-full border border-blue-500 bg-white sm:-left-0.5 sm:-top-0.5 sm:size-2"
              />
              <div
                onPointerDown={(e) => handleResizeStart(e, 'top-right', el.id)}
                className="absolute -right-1.5 -top-1.5 z-100 size-3 touch-none cursor-sw-resize rounded-full border border-blue-500 bg-white sm:-right-0.5 sm:-top-0.5 sm:size-2"
              />
              <div
                onPointerDown={(e) => handleResizeStart(e, 'bottom-left', el.id)}
                className="absolute -bottom-1.5 -left-1.5 z-100 size-3 touch-none cursor-sw-resize rounded-full border border-blue-500 bg-white sm:-bottom-0.5 sm:-left-0.5 sm:size-2"
              />
              <div
                onPointerDown={(e) => handleResizeStart(e, 'bottom-right', el.id)}
                className="absolute -bottom-1.5 -right-1.5 z-100 size-3 touch-none cursor-nwse-resize rounded-full border border-blue-500 bg-white sm:-bottom-0.5 sm:-right-0.5 sm:size-2"
              />
            </div>
          </div>
        )}
        <label
          key={el.id}
          style={{
            position: 'absolute',
            left: el.x,
            width: el.width,
            height: el.height,
            top: el.y,
          }}
          className={`${selectedElementMove === el.id ? 'cursor-move' : ''} no-select border-2 border-black  ${
            el.type === 'rectangle' ? 'rounded-[5px]' : 'rounded-full'
          } `}
        />
      </div>
    );
  });
};

export default CanvasElements;
