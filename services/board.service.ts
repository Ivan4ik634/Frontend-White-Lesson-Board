import { supabase } from '@/lib/supabase';

export const boardService = {
  findAll() {
    return supabase.from('board').select('*');
  },

  findOne(boardId: string) {
    return supabase.from('board').select('*').eq('id', boardId).single();
  },

  create(userId: string) {
    return supabase.from('board').insert({ user_id: userId }).single();
  },

  update(id: string, update: { access: 'public' | 'private' }) {
    return supabase.from('board').update(update).eq('id', id);
  },

  delete(boardId: string) {
    return supabase.from('board').delete().eq('id', boardId).single();
  },
};
