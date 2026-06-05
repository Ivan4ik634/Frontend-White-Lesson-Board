import { supabase } from '@/lib/supabase';
import { BoardUserT } from '@/types/Board';
import { PostgrestFilterBuilder } from '@supabase/supabase-js';

export const boardUserService = {
  findAll() {
    return supabase.from('board_user').select('*');
  },

  findInBoard(
    boardId: string,
  ): PostgrestFilterBuilder<any, any, any, BoardUserT[], 'board_user', unknown, 'GET'> {
    return supabase
      .from('board_user')
      .select(
        `id,
        board_id,
        created_at,
        x,
        y,
  user_id(
    id,
    name,
    avatar
  )`,
      )
      .eq('board_id', boardId) as unknown as PostgrestFilterBuilder<
      any,
      any,
      any,
      BoardUserT[],
      'board_user',
      unknown,
      'GET'
    >;
  },

  findOne(
    userId: string,
    boardId: string,
  ): PostgrestFilterBuilder<any, any, any, BoardUserT, 'board_user', unknown, 'GET'> {
    return supabase
      .from('board_user')
      .select(
        `id,
        board_id,
        created_at,
        x,
        y,
  user_id(
    id,
    name,
    avatar
  )`,
      )
      .eq('user_id', userId)
      .eq('board_id', boardId)
      .single() as unknown as PostgrestFilterBuilder<
      any,
      any,
      any,
      BoardUserT,
      'board_user',
      unknown,
      'GET'
    >;
  },

  create(boardId: string, userId: string) {
    return supabase.from('board_user').insert({ board_id: boardId, user_id: userId });
  },

  update(boardId: string, userId: string, x: number, y: number) {
    return supabase
      .from('board_user')
      .update({ x, y })
      .eq('board_id', boardId)
      .eq('user_id', userId);
  },

  delete(boardId: string, userId: string) {
    return supabase.from('board_user').delete().eq('board_id', boardId).eq('user_id', userId);
  },
};
