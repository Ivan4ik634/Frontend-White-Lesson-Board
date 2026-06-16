'use client';

import { colors } from '@/configs/colors';
import { FC } from 'react';

interface Props {
  color: string;
  setColor: React.Dispatch<React.SetStateAction<string>>;
}

const CanvasPickColors: FC<Props> = ({ color, setColor }) => {
  return (
    <div
      onPointerDown={(event) => event.stopPropagation()}
      onPointerMove={(event) => event.stopPropagation()}
      onPointerUp={(event) => event.stopPropagation()}
      className="top-2 bg-stone-200 dark:bg-stone-800 hidden sm:flex z-20 rounded-[5px] right-2 absolute  gap-x-2 items-center p-2">
      {colors.map((c, i) => (
        <div
          key={i}
          className={`rounded-[5px] p-2 flex justify-center ${c.value === color ? 'bg-black/10' : ''}`}>
          <div
            onClick={() => setColor(c.value)}
            style={{ backgroundColor: c.value }}
            className="w-6 h-6 rounded-full cursor-pointer"
          />
        </div>
      ))}
    </div>
  );
};

export default CanvasPickColors;
