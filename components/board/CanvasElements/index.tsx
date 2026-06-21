'use client';

import { ElementT } from '@/types/Element';
import { FC, PointerEvent } from 'react';

interface Props {
  elements: ElementT[];
  editingId: string | null;
  startEditing: (id: string) => void;
  selectedElementIds: string[];
  selectedElementMove: string;
  elementsIdsRemove: string[];
  handleUpdateObjectDown: (e: PointerEvent<HTMLDivElement>, id: string) => void;
  handleUpdateObjectMove: (e: PointerEvent<HTMLDivElement>, id: string) => void;
  handleUpdateObjectUp: (e: PointerEvent<HTMLDivElement>, id: string) => void;
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
  elementsIdsRemove,
  startEditing,
  handleResizeStart,
  handleUpdateObjectDown,
  handleUpdateObjectMove,
  handleUpdateObjectUp,
}) => {
  return elements.map((el) => {
    console.log(
      'STATE AFTER UPDATE',
      elements.find((e) => e.id === el?.id),
    );
    if (el.type === 'pen')
      return (
        <svg
          key={el.id}
          className={`${elementsIdsRemove?.includes(el.id) ? 'opacity-50' : ''} z-10  no-select absolute  overflow-visible pointer-events-none`}>
          <polyline
            points={el.points.map((p) => `${p.x},${p.y}`).join(' ')}
            fill="none"
            stroke={`${selectedElementIds.includes(el.id) ? 'blue' : el.color}`}
            strokeWidth={3}
          />
        </svg>
      );

    return (
      <div key={el.id}>
        {selectedElementIds.includes(el.id) && (
          <div
            style={{
              position: 'absolute',
              left: el.x,
              width: el.width,
              height: el.height,
              top: el.y,
              visibility: el.type === 'text' && editingId === el.id ? 'hidden' : 'visible',
            }}
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
            className={`z-10 ${elementsIdsRemove.includes(el.id) ? 'opacity-50' : ''}  border-[1px] border-blue-500`}>
            <div className="relative w-full h-full">
              <div
                onPointerDown={(e) => handleResizeStart(e, 'top-left', el.id)}
                className="absolute -left-2 -top-2 z-100 size-3 touch-none cursor-nwse-resize rounded-[1px] border border-blue-500 bg-white sm:-left-1.5 sm:-top-1.5 sm:size-2"
              />
              <div
                onPointerDown={(e) => handleResizeStart(e, 'top-right', el.id)}
                className="absolute -right-2 -top-2 z-100 size-3 touch-none cursor-sw-resize rounded-[1px] border border-blue-500 bg-white sm:-right-1.5 sm:-top-1.5 sm:size-2"
              />
              <div
                onPointerDown={(e) => handleResizeStart(e, 'bottom-left', el.id)}
                className="absolute -bottom-2 -left-2 z-100 size-3 touch-none cursor-sw-resize rounded-[1px] border border-blue-500 bg-white sm:-bottom-1.5 sm:-left-1.5 sm:size-2"
              />
              <div
                onPointerDown={(e) => handleResizeStart(e, 'bottom-right', el.id)}
                className="absolute -bottom-2 -right-2 z-100 size-3 touch-none cursor-nwse-resize rounded-[1px] border border-blue-500 bg-white sm:-bottom-1.5 sm:-right-1.5 sm:size-2"
              />
            </div>
          </div>
        )}
        {el.type === 'text' ? (
          <div
            key={el.id}
            onPointerDown={(e) => {
              e.stopPropagation();
              handleUpdateObjectDown(e, el.id);
            }}
            onPointerMove={(e) => {
              e.stopPropagation();
              handleUpdateObjectMove(e, el.id);
            }}
            onPointerUp={(e) => {
              e.stopPropagation();
              handleUpdateObjectUp(e, el.id);
            }}
            onDoubleClick={(e) => {
              e.stopPropagation();
              startEditing(el.id);
            }}
            className={`absolute z-10  ${elementsIdsRemove.includes(el.id) ? 'opacity-50' : ''} break-words no-select  `}
            style={{
              left: el.x,
              color: el.color,
              overflow: 'hidden',

              width: el.width,
              height: el.height,
              fontSize: el.fontSize,

              top: el.y,
              visibility: editingId === el.id ? 'hidden' : 'visible',
            }}>
            {el.text}
          </div>
        ) : el.type === 'image' ? (
          <div
            style={{
              position: 'absolute',
              left: el.x,
              width: el.width,
              height: el.height,
              top: el.y,
            }}
            draggable={false}
            onDragStart={(e) => e.preventDefault()}>
            <img
              src={el.file}
              alt="Element"
              draggable={false}
              onDragStart={(e) => e.preventDefault()}
              style={{ userSelect: 'none', pointerEvents: 'none' }}
              className={`${selectedElementIds.includes(el.id) ? 'z-20' : 'z-10'} ${elementsIdsRemove.includes(el.id) ? 'opacity-50' : ''} w-full h-full ${selectedElementMove === el.id ? 'cursor-move' : ''} no-select rounded-[5px]`}
            />
          </div>
        ) : (
          <label
            style={{
              position: 'absolute',
              left: el.x,
              borderColor: el.color,
              width: el.width,
              height: el.height,
              top: el.y,
            }}
            className={`${selectedElementIds.includes(el.id) ? 'z-20' : ''} ${elementsIdsRemove.includes(el.id) ? 'opacity-50' : ''} border-2 ${selectedElementMove === el.id ? 'cursor-move' : ''} no-select   ${
              el.type === 'rectangle' ? 'rounded-[5px]' : 'rounded-full'
            } `}
          />
        )}
      </div>
    );
  });
};

export default CanvasElements;
