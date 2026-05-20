import { BoardShell } from "@/components/board/board-shell";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function BoardRoutePage({ params }: PageProps) {
  const { id } = await params;

  return <BoardShell boardId={id} />;
}
