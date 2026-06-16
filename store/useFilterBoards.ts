import { FilterBoardsT } from '@/types/Board';
import { create } from 'zustand';

type FilterBoards = {
  filters: FilterBoardsT;
  setFilters: (value: FilterBoardsT | ((prev: FilterBoardsT) => FilterBoardsT)) => void;
};

export const useFilterBoards = create<FilterBoards>((set) => ({
  filters: {
    sortByMembers: 'Ascending',
    search: '',
    sortByDate: 'Ascending',
    sortByAccess: 'All',
  },
  setFilters: (value) =>
    set((state) => ({
      filters: typeof value === 'function' ? value(state.filters) : value,
    })),
}));
