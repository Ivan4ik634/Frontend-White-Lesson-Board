import { supabase } from '@/lib/supabase';

export const uploadService = {
  async uploadImage(userId: string, file: File) {
    const uuid = crypto.randomUUID();
    return await supabase.storage.from('Images').upload(`${userId}/${uuid}`, file);
  },
  async deleteImage(url: string) {
    return await supabase.storage.from('Images').remove([url]);
  },
  async getPublicUrl(url: string) {
    return await supabase.storage.from('Images').getPublicUrl(url);
  },
};
