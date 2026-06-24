import { uploadService } from '@/services/upload.service';
import { UserT } from '@/types/UserT';
import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

export const useUploadImage = (profile: UserT | null, initialUrl?: string) => {
  const ref = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState(initialUrl || '');

  const t = useTranslations('hooks');

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!profile) return toast.error(t('User_profile_is_not_available'));

    const file = e.target.files?.[0];
    if (!file) return;

    const { data: image } = await uploadService.uploadImage(profile?.id, file);
    if (!image) return;

    const { data } = await uploadService.getPublicUrl(image.path);
    setUrl(data.publicUrl);
  };
  const handleDeleteImage = async () => {
    await uploadService.deleteImage(url);
    setUrl('');
  };
  return { ref, url, setUrl, handleUploadImage, handleDeleteImage };
};
