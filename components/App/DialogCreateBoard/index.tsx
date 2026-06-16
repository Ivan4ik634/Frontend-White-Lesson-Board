'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { PAGES } from '@/configs/PAGES';
import { useProfile } from '@/hooks/useProfile';
import { useUploadImage } from '@/hooks/useUploadImage';
import { useRouter } from '@/i18n/navigation';
import { boardUserService } from '@/services/board-user.service';
import { boardService } from '@/services/board.service';
import { BoardCreateForm } from '@/types/Board';
import { useTranslations } from 'next-intl';
import { FC, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { CiImageOn } from 'react-icons/ci';
import { FaRegTrashCan } from 'react-icons/fa6';
interface Props {
  children: React.ReactNode;
}

const DialogCreateBoard: FC<Props> = ({ children }) => {
  const { profile } = useProfile();
  const router = useRouter();
  const t = useTranslations('boards');
  const common = useTranslations('common');
  const validation = useTranslations('validation');

  const { ref, url, handleUploadImage, handleDeleteImage } = useUploadImage(profile);

  const [access, setAccess] = useState<'Public' | 'Private'>('Public');
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<BoardCreateForm>({
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const onSubmit: SubmitHandler<BoardCreateForm> = async (data) => {
    if (!profile) return;
    const { data: board } = await boardService.create({
      user_id: profile.id,
      image: url,
      description: data.description,
      title: data.title,
      access: access.toLowerCase() as 'public' | 'private',
    });
    await boardUserService.create(board.id, profile.id);
    router.push(PAGES.BOARD(board.id));
  };

  return (
    <Dialog>
      <DialogTrigger render={children as React.ReactElement} />
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-[425px]">
        <DialogTitle>{t('createTitle')}</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)} className={'flex flex-col gap-3 w-full'}>
          <div>
            {url && (
              <img
                src={url}
                alt={t('boardImageAlt')}
                className="w-full object-cover aspect-video rounded-[5px]"
              />
            )}
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <Button type="button" onClick={() => ref.current?.click()} className="w-full">
                <CiImageOn />
                {t('uploadImage')}
              </Button>
              <Button
                type="button"
                onClick={handleDeleteImage}
                variant="destructive"
                className="w-full">
                <FaRegTrashCan />
                {t('deleteImage')}
              </Button>
              <input ref={ref} type="file" onChange={handleUploadImage} hidden />
            </div>
          </div>
          <div>
            <Input
              {...register('title', { required: validation('required') })}
              placeholder={t('boardNamePlaceholder')}
            />
            <p className="text-red-500">{errors.title?.message}</p>
          </div>
          <div>
            <Textarea
              {...register('description', { required: validation('required') })}
              placeholder={t('boardDescriptionPlaceholder')}
              className="resize-none"
            />
            <p className="text-red-500">{errors.description?.message}</p>
          </div>
          <div className="flex items-center gap-x-3">
            <Select
              value={access}
              onValueChange={(value) => setAccess(value as 'Public' | 'Private')}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder={t('access')} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{t('access')}</SelectLabel>
                  <SelectItem value="Public">{t('public')}</SelectItem>
                  <SelectItem value="Private">{t('private')}</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" type="button" size={'lg'} />}>
                {common('cancel')}
            </DialogClose>
            <Button type="submit" size={'lg'} className="w-full sm:w-auto">
              {common('submit')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogCreateBoard;
