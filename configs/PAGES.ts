class Pages {
  LOGIN = '/login';
  REGISTER = '/register';
  PROFILE = '/profile';
  HOME = '/app';
  LENDING = '/';
  SETTINGS = '/settings';
  BOARDS = '/boards';
  BOARD(boardId: string) {
    return `/board/${boardId}`;
  }
  INVITE_IN_BOARD(boardId: string) {
    return `/board/${boardId}/invite`;
  }
}
export const PAGES = new Pages();
