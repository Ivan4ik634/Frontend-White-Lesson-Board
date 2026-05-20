class Pages {
  LOGIN = '/login';
  REGISTER = '/register';
  PROFILE = '/profile';
  HOME = '/';
  BOARDS = '/boards';
  BOARD(boardId: string) {
    return `/board/${boardId}`;
  }
  INVITE_IN_BOARD(boardId: string) {
    return `/board/${boardId}/invite`;
  }
  SETTINGS = '/settings';
}
export const PAGES = new Pages();
