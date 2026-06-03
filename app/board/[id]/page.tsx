import { BoardShell } from '@/components/board/board-shell';
import { noIndexRobots } from '@/lib/seo';
import OnlineTracker from '@/providers/OnlineProvider';
import type { Metadata } from 'next';

type PageProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: 'Shared Board',
  description: 'A private collaborative board for work, study, sketches, planning, and teamwork.',
  robots: noIndexRobots,
};

export default async function BoardRoutePage({ params }: PageProps) {
  const { id } = await params;

  return (
    <>
      <OnlineTracker />
      <BoardShell boardId={id} />
    </>
  );
}
