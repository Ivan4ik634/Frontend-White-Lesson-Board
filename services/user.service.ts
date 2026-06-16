import { supabase } from '@/lib/supabase';
import { UserProfile, UserProfileUpdate } from '@/types/UserT';

export const userService = {
  async create(userId: string, userProfile: UserProfile) {
    return await supabase.from('profile').insert({ id: userId, ...userProfile });
  },
  async update(id: string, data: UserProfileUpdate) {
    return await supabase.from('profile').update(data).eq('id', id);
  },
  async findOne(id: string) {
    return await supabase.from('profile').select().eq('id', id).single();
  },
};
