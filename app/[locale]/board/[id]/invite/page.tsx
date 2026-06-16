import { BoardInvite } from '@/components/board/BoardInvite';
import { noIndexRobots } from '@/lib/seo';
import type { Metadata } from 'next';

type PageProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: 'Board Invite',
  description: 'Accept an invitation to a private Claro shared board.',
  robots: noIndexRobots,
};

export default async function BoardInvitePage({ params }: PageProps) {
  const { id } = await params;

  return <BoardInvite boardId={id} />;
}
