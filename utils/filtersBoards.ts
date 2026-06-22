import { BoardT, FilterBoardsT } from '@/types/Board';

export const filtersBoards = (boards: BoardT[], filters: FilterBoardsT) => {
  const filteredBoards = [...boards]
    .filter((board) => board.title.toLowerCase().includes(filters.search.toLowerCase()))
    .sort((a, b) => {
      if (a.access !== b.access) {
        if (filters.sortByAccess === 'Public') {
          return a.access === 'public' ? -1 : 1;
        }
        if (filters.sortByAccess === 'Private') {
          return a.access === 'private' ? -1 : 1;
        }
      }

      if (a.members_count !== b.members_count) {
        if (filters.sortByMembers === 'Ascending') {
          return a.members_count - b.members_count;
        }

        return b.members_count - a.members_count;
      }

      if (filters.sortByDate === 'Ascending') {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }

      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  return { filteredBoards };
};
