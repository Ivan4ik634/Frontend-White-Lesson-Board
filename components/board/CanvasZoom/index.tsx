'use client';

import { Minus, Plus } from 'lucide-react';
import { FC } from 'react';

interface Props {
  zoom: number;
  addZoom: (zoom: number) => void;
}

const CanvasZoom: FC<Props> = ({ zoom, addZoom }) => {
  return (
    <div
      onPointerDown={(event) => event.stopPropagation()}
      onPointerMove={(event) => event.stopPropagation()}
      onPointerUp={(event) => event.stopPropagation()}
      className="hidden sm:flex right-2 border border-border bg-background/95  shadow-sm backdrop-blur rounded-[5px] p-3 bottom-2 absolute z-20 gap-x-3">
      <Minus
        className={`cursor-pointer hover:opacity-100 opacity-75 transition-all duration-300 ${zoom > 0.3 ? 'hover:opacity-50 opacity-50' : ''}`}
        onClick={() => (zoom > 0.3 ? addZoom(-0.1) : '')}
        size={18}
      />
      <p>{Number(zoom * 100).toFixed(0)}%</p>
      <Plus
        className={`cursor-pointer hover:opacity-100 opacity-75 transition-all duration-300 ${zoom < 1.5 ? 'hover:opacity-50 opacity-50' : ''}`}
        onClick={() => (zoom < 1.5 ? addZoom(0.1) : '')}
        size={18}
      />
    </div>
  );
};

export default CanvasZoom;
