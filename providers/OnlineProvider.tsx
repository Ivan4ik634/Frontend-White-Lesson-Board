'use client';

import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/lib/supabase';
import { useOnlineUsers } from '@/store/onlineUsers';
import { useEffect } from 'react';

export default function OnlineTracker() {
  const { profile } = useProfile();
  const { setOnlineUsers } = useOnlineUsers();

  useEffect(() => {
    const userId = profile?.id;
    if (!userId) return;

    const channel = supabase.channel('online-users', {
      config: {
        presence: {
          key: userId,
        },
      },
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();

        const onlineUserIds = Object.keys(state);
        console.log('onlineUserIds', onlineUserIds);
        setOnlineUsers(onlineUserIds);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user_id: userId,
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile]);

  return null;
}
