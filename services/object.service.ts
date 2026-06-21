import { supabase } from '@/lib/supabase';
import { ElementT } from '@/types/Element';

export const objectService = {
  findAll(boardId: string) {
    return supabase.from('object').select('*').eq('board_id', boardId);
  },

  findInBoard(id: string) {
    return supabase.from('object').select(`*`).eq('board_id', id);
  },

  create(boardId: string, userId: string, object: ElementT) {
    return supabase.from('object').insert({
      board_id: boardId,
      last_change_user: userId,
      objectId: object.id,
      user_id: userId,
      object,
    });
  },

  update(objectId: string, object: ElementT) {
    return supabase
      .from('object')
      .update({
        object,
      })
      .eq('objectId', objectId);
  },
  createMany(boardId: string, userId: string, objects: ElementT[]) {
    return supabase.from('object').insert(
      objects.map((object) => ({
        board_id: boardId,
        last_change_user: userId,
        objectId: object.id,
        user_id: userId,
        object,
      })),
    );
  },
  replaceBoard(boardId: string, userId: string, elements: ElementT[]) {
    return supabase.from('object').upsert(
      elements.map((el) => ({
        board_id: boardId,
        last_change_user: userId,
        objectId: el.id,
        object: el,
      })),
    );
  },

  deleteMany(objectIds: string[]) {
    return supabase.from('object').delete().in('objectId', objectIds);
  },

  delete(objectId: string) {
    return supabase.from('object').delete().eq('objectId', objectId);
  },
};
