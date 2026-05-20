import { BoardShell } from '@/components/board/board-shell';
import { noIndexRobots } from '@/lib/seo';
import type { Metadata } from 'next';

type PageProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: 'Study Board',
  description: 'A private collaborative study board for lessons, sketches, and teamwork.',
  robots: noIndexRobots,
};

export default async function BoardRoutePage({ params }: PageProps) {
  const { id } = await params;

  return <BoardShell boardId={id} />;
}
