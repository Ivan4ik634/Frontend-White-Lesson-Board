'use client';

import { useBoardStore } from '@/hooks/useBoardStore';
import { useOpenAiChat } from '@/store/useOpenAiChat';
import { Send, X } from 'lucide-react';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Textarea } from '../ui/textarea';
import Title from '../ui/title';
import BoardHeader from './BoardHeader';
import { Canvas } from './canvas';

type BoardShellProps = {
  boardId: string;
};

export function BoardShell({ boardId }: BoardShellProps) {
  const { events, elements, profile, setElements, loading, cameraInit } = useBoardStore({
    boardId,
  });

  const { open: openAiChat, setOpen: setOpenAiChat } = useOpenAiChat();

  if (loading) {
    return (
      <div className="flex h-dvh items-center justify-center bg-muted/35 px-4 text-sm text-muted-foreground">
        Loading board...
      </div>
    );
  }

  return (
    <div className="h-dvh flex bg-muted/35 overflow-hidden">
      <div className="flex h-full w-full  flex-col  ">
        <BoardHeader boardId={boardId} />
        <div className="min-h-0 flex-1 p-1.5 pb-2 sm:p-2 md:p-3 pr-0">
          <Canvas
            mode="board"
            profile={profile}
            initData={elements}
            cameraInit={cameraInit}
            setElements={setElements}
            events={events}
            boardId={boardId}
          />
        </div>
      </div>
      {openAiChat && (
        <div className="flex h-full w-full max-w-[400px] flex-col  bg-background ml-3 p-3 text-[14px] font-medium text-muted-foreground shadow-sm backdrop-blur">
          <div className="mb-5 flex w-full justify-between">
            <Title>Ai chat</Title>
            <X className="cursor-pointer" onClick={() => setOpenAiChat(false)} />
          </div>
          <ScrollArea className="h-[750px]">
            <div className=" flex flex-col gap-y-5 mt-5">
              <div>
                This is a placeholder for the Ai chat. You can use this space to integrate an AI
                chat interface, allowing users to interact with an AI assistant while collaborating
                on the board.
              </div>
              <div className="bg-muted/50 p-2 w-fit ml-auto mt-2 rounded-md text-[14px] text-muted-foreground">
                <p>This is a placeholder for the Ai chat</p>
              </div>
              <div>
                This is a placeholder for the Ai chat. You can use this space to integrate an AI
                chat interface, allowing users to interact with an AI assistant while collaborating
                on the board.
              </div>
              <div className="bg-muted/50 p-2 w-fit ml-auto mt-2 rounded-md text-[14px] text-muted-foreground">
                <p>This is a placeholder for the Ai chat</p>
              </div>
              <div>
                This is a placeholder for the Ai chat. You can use this space to integrate an AI
                chat interface, allowing users to interact with an AI assistant while collaborating
                on the board.
              </div>
              <div className="bg-muted/50 p-2 w-fit ml-auto mt-2 rounded-md text-[14px] text-muted-foreground">
                <p>This is a placeholder for the Ai chat</p>
              </div>
              <div>
                This is a placeholder for the Ai chat. You can use this space to integrate an AI
                chat interface, allowing users to interact with an AI assistant while collaborating
                on the board.
              </div>
              <div className="bg-muted/50 p-2 w-fit ml-auto mt-2 rounded-md text-[14px] text-muted-foreground">
                <p>This is a placeholder for the Ai chat</p>
              </div>
              <div>
                This is a placeholder for the Ai chat. You can use this space to integrate an AI
                chat interface, allowing users to interact with an AI assistant while collaborating
                on the board.
              </div>
              <div className="bg-muted/50 p-2 w-fit ml-auto mt-2 rounded-md text-[14px] text-muted-foreground">
                <p>This is a placeholder for the Ai chat</p>
              </div>
              <div>
                This is a placeholder for the Ai chat. You can use this space to integrate an AI
                chat interface, allowing users to interact with an AI assistant while collaborating
                on the board.
              </div>
              <div className="bg-muted/50 p-2 w-fit ml-auto mt-2 rounded-md text-[14px] text-muted-foreground">
                <p>This is a placeholder for the Ai chat</p>
              </div>
              <div>
                This is a placeholder for the Ai chat. You can use this space to integrate an AI
                chat interface, allowing users to interact with an AI assistant while collaborating
                on the board.
              </div>
              <div className="bg-muted/50 p-2 w-fit ml-auto mt-2 rounded-md text-[14px] text-muted-foreground">
                <p>This is a placeholder for the Ai chat</p>
              </div>
              <div className="bg-muted/50 p-2 w-fit ml-auto mt-2 rounded-md text-[14px] text-muted-foreground">
                <p>This is a placeholder for the Ai chat</p>
              </div>
              <div className="bg-muted/50 p-2 w-fit ml-auto mt-2 rounded-md text-[14px] text-muted-foreground">
                <p>This is a placeholder for the Ai chat</p>
              </div>
              <div className="bg-muted/50 p-2 w-fit ml-auto mt-2 rounded-md text-[14px] text-muted-foreground">
                <p>This is a placeholder for the Ai chat</p>
              </div>
            </div>
          </ScrollArea>
          <div className="flex flex-1 w-full mt-5 items-end h-full gap-2  pb-2">
            <div className="relative w-full">
              <Textarea className="resize-none pb-[75px]" placeholder="Add a message..." />
              <Button className="absolute rounded-full h-10 w-10 bottom-2 right-2">
                <Send />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
