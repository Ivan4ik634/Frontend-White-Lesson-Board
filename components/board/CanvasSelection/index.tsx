'use client';

import { FC } from 'react';

interface Props {
  isSelectionRef: React.MutableRefObject<boolean>;
  selection: { x: number; y: number; width: number; height: number };
}

const CanvasSelection: FC<Props> = ({ isSelectionRef, selection }) => {
  return (
    isSelectionRef && (
      <div
        style={{
          left: selection.x,
          top: selection.y,
          width: selection.width,
          height: selection.height,
        }}
        className="absolute border-blue-500 bg-blue-500/20 rounded-[8px]"
      />
    )
  );
};

export default CanvasSelection;
