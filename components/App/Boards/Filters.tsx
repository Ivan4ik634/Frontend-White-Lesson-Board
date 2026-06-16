'use client';

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
import { useFilterBoards } from '@/store/useFilterBoards';
import { useTranslations } from 'next-intl';
import { FC } from 'react';

interface Props {}

const FiltersBoards: FC<Props> = (props) => {
  const { setFilters, filters } = useFilterBoards();
  const t = useTranslations('boards');
  const common = useTranslations('common');

  return (
    <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:flex xl:items-center">
      <Select
        value={filters.sortByAccess}
        onValueChange={(value) => setFilters((prev) => ({ ...prev, sortByAccess: value! }))}>
        <SelectTrigger className="w-full xl:w-[150px]">
          <SelectValue placeholder={t('access')} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{t('access')}</SelectLabel>
            <SelectItem value="All">{t('all')}</SelectItem>
            <SelectItem value="Public">{t('public')}</SelectItem>
            <SelectItem value="Private">{t('private')}</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select
        value={filters.sortByDate}
        onValueChange={(value) => setFilters((prev) => ({ ...prev, sortByDate: value! }))}>
        <SelectTrigger className="w-full xl:w-[150px]">
          <SelectValue placeholder={t('date')} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{t('date')}</SelectLabel>
            <SelectItem value="Ascending">{t('ascending')}</SelectItem>
            <SelectItem value="Descending">{t('descending')}</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select
        value={filters.sortByMembers}
        onValueChange={(value) => setFilters((prev) => ({ ...prev, sortByMembers: value! }))}>
        <SelectTrigger className="w-full xl:w-[150px]">
          <SelectValue placeholder={t('members', { count: 2 })} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{t('members', { count: 2 })}</SelectLabel>
            <SelectItem value="Ascending">{t('ascending')}</SelectItem>
            <SelectItem value="Descending">{t('descending')}</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Input
        value={filters.search}
        onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
        className="w-full py-1 sm:col-span-2 xl:w-[300px]"
        placeholder={common('search')}
      />
    </div>
  );
};

export default FiltersBoards;
