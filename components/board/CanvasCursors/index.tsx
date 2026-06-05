'use client';

import { colors } from '@/configs/colors';
import { useOnlineUsers } from '@/store/onlineUsers';
import { useUsersInBoard } from '@/store/useUsersInBoard';
import { UserT } from '@/types/UserT';
import { MousePointer2 } from 'lucide-react';
import { FC } from 'react';

interface Props {
  profile: UserT | null;
  zoom: number;
}

const CanvasCursors: FC<Props> = ({ profile, zoom }) => {
  const { users: cursors } = useUsersInBoard();
  const { onlineUsers } = useOnlineUsers();
  return cursors.map((cursor, i) => {
    const color = colors[i % colors.length];
    if (profile?.id === cursor.user_id.id || !onlineUsers.includes(cursor.user_id.id)) return null;
    return (
      <div
        key={cursor.id}
        style={{
          position: 'absolute',
          top: cursor.y,
          left: cursor.x,
          transform: `scale(${1 / zoom})`,
          transformOrigin: 'top left',
        }}
        className="pointer-events-none flex items-center gap-x-3">
        <MousePointer2 style={{ fill: color.value, color: color.value }} />
        <div
          style={{
            width: `${Math.max(cursor.user_id.name.length * 12, 20)}px`,
            backgroundColor: color.value,
          }}
          className="p-3 flex justify-center rounded-[5px]">
          <p className="text-white">{cursor.user_id.name}</p>
        </div>
      </div>
    );
  });
};

export default CanvasCursors;
