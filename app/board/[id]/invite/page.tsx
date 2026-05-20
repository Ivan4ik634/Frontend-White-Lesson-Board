import { BoardInvite } from '@/components/board/BoardInvite';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function BoardInvitePage({ params }: PageProps) {
  const { id } = await params;

  return <BoardInvite boardId={id} />;
}
