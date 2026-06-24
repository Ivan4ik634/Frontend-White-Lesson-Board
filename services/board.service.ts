import { supabase } from '@/lib/supabase';
import { BoardCreate } from '@/types/Board';

export const boardService = {
  findAll() {
    return supabase.from('board').select('*');
  },

  findOne(boardId: string) {
    return supabase.from('board').select('*').eq('id', boardId).single();
  },

  create(data: BoardCreate) {
    return supabase.from('board').insert(data).select().single();
  },

  update(id: string, update: Partial<BoardCreate>) {
    return supabase.from('board').update(update).eq('id', id);
  },

  delete(boardId: string) {
    return supabase.from('board').delete().eq('id', boardId).single();
  },
};
