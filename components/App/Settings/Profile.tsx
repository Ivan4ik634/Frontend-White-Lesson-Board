'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useProfile } from '@/hooks/useProfile';
import { useUploadImage } from '@/hooks/useUploadImage';
import { supabase } from '@/lib/supabase';
import { userService } from '@/services/user.service';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function Profile() {
  const { profile } = useProfile();
  const t = useTranslations('settings');
  const common = useTranslations('common');
  const { ref, url, setUrl, handleUploadImage, handleDeleteImage } = useUploadImage(profile);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: profile?.name || '',
      email: profile?.email || '',
    },
  });

  useEffect(() => {
    if (!profile) return;
    reset({
      name: profile.name,
      email: profile.email,
    });
    if (profile.avatar) setUrl(profile.avatar);
  }, [profile, reset]);

  const onSubmit: SubmitHandler<{ name: string; email: string }> = async (data) => {
    if (!profile) return;
    if (profile.email !== data.email) {
      const { error } = await supabase.auth.updateUser({
        email: data.email,
      });

      if (error) {
        toast.error(error.message);

        await userService.update(profile.id, {
          name: data.name,
          avatar: url,
        });

        return;
      }
    }

    await userService.update(profile.id, {
      name: data.name,
      email: data.email,
      avatar: url,
    });
    toast.success(t('profileSaved'));
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('profile')}</CardTitle>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="grid gap-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Avatar size="lg">
              <AvatarImage src={url || ''} alt="avatar" />
              <AvatarFallback>{profile?.name?.[0]}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="text-sm text-muted-foreground">{t('avatar')}</div>
              <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                <Button onClick={() => ref.current?.click()} variant="outline" size="sm">
                  {t('changeAvatar')}
                </Button>
                {url && (
                  <Button onClick={handleDeleteImage} variant="outline" size="sm">
                    {t('deleteAvatar')}
                  </Button>
                )}
              </div>
              <input type="file" ref={ref} className="hidden" onChange={handleUploadImage} />
            </div>
          </div>

          <div>
            <label className="text-sm  text-muted-foreground">{common('name')}</label>
            <Input className="mt-1" {...register('name', { required: true })} />
          </div>

          <div>
            <label className="text-sm  text-muted-foreground">{common('email')}</label>
            <Input className="mt-1" {...register('email', { required: true })} />
          </div>
        </CardContent>

        <CardFooter className="mt-4 flex justify-end gap-2">
          <Button size="lg" variant="default" type="submit" className="w-full sm:w-auto">
            {common('save')}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
