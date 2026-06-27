'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import Title from '@/components/ui/title';
import { systemPromptCreateElements, systemPromptUser } from '@/data/systemPrompts';
import { cn } from '@/lib/utils';
import { openrouterService } from '@/services/openrouter.service';
import { useCameraStore } from '@/store/useCameraStore';
import { useOpenAiChat } from '@/store/useOpenAiChat';
import { useTheme } from '@/store/useTheme';
import { ElementT, EventsCanvas } from '@/types/Element';
import { Bot, Loader2, Send, Sparkles, X } from 'lucide-react';
import { FC, useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Props {
  setElements: React.Dispatch<React.SetStateAction<ElementT[]>>;
  events: EventsCanvas;
}

const BoardAiChat: FC<Props> = ({ setElements, events }) => {
  const { open: openAiChat, setOpen: setOpenAiChat } = useOpenAiChat();
  const [text, setText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<{ type: 'user' | 'ai'; message: string }[]>([]);

  const [loading, setLoading] = useState(false);
  const [type, setType] = useState('chat');
  const { cameraStore } = useCameraStore();
  const { theme } = useTheme();

  const handleSubmit = async () => {
    if (!text.trim() || loading) return;

    let prompt;

    if (type === 'chat') {
      prompt = systemPromptUser(text);
    } else {
      prompt = systemPromptCreateElements({ ...cameraStore }, cameraStore.zoom, text, theme);
    }

    setMessages((prev) => [...prev, { type: 'user', message: text }]);
    setText('');

    setLoading(true);
    const res = await openrouterService.owlAlphaModel(prompt!);
    setLoading(false);
    if (type === 'build') {
      const cleaned = res.replace(/^```json\s*/i, '').replace(/\s*```$/, '');
      const data = JSON.parse(cleaned);
      setMessages((prev) => [
        ...prev,
        { type: 'ai', message: data.message.replace(/\n/g, '\n\n') },
      ]);
      const result = data.actions.map((action: Omit<ElementT, 'id'>) => ({
        id: crypto.randomUUID(),
        ...action,
      }));

      setElements((prev) => [...prev, ...result]);
      await events.handleCreateElements(result);

      return;
    }
    setLoading(false);

    setMessages((prev) => [...prev, { type: 'ai', message: res.replace(/\n/g, '\n\n') }]);
  };
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (!openAiChat) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex h-dvh w-full flex-col bg-background text-sm font-medium text-muted-foreground shadow-lg backdrop-blur sm:static sm:z-auto sm:ml-3 sm:h-full sm:max-w-[400px] sm:rounded-lg sm:border sm:border-border sm:shadow-sm"
      onPointerDown={(event) => event.stopPropagation()}
      onPointerMove={(event) => event.stopPropagation()}
      onPointerUp={(event) => event.stopPropagation()}>
      <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:border-b-0 sm:px-3 sm:pb-2 sm:pt-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary sm:size-8">
            <Sparkles className="size-4" aria-hidden />
          </div>
          <div className="min-w-0">
            <Title className="truncate text-lg sm:text-xl">Ai chat</Title>
            <p className="truncate text-xs font-normal text-muted-foreground">
              Chat or build on the board
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Close AI chat"
          onClick={() => setOpenAiChat(false)}
          className="size-9 rounded-md">
          <X className="size-4" aria-hidden />
        </Button>
      </div>

      <ScrollArea className="min-h-0 flex-1 px-4 sm:px-3">
        <div className="flex min-h-full flex-col gap-4 py-4">
          {messages.length === 0 && (
            <div className="mt-auto flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-muted/30 px-5 py-8 text-center">
              <div className="flex size-10 items-center justify-center rounded-lg bg-background text-foreground shadow-xs">
                <Bot className="size-5" aria-hidden />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Ask anything about the board
                </p>
                <p className="mt-1 text-xs font-normal text-muted-foreground">
                  Use Build to create elements, or Chat for help.
                </p>
              </div>
            </div>
          )}

          {messages.map((message, index) => {
            if (message.type === 'user') {
              return (
                <div
                  key={index}
                  className="ml-auto max-w-[85%] rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground shadow-xs">
                  <p className="whitespace-pre-wrap break-words">{message.message}</p>
                </div>
              );
            }

            return (
              <div
                key={index}
                className="prose prose-sm max-w-[92%] rounded-lg bg-muted/50 px-3 py-2 text-foreground dark:prose-invert prose-p:my-1 prose-pre:overflow-x-auto">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.message}</ReactMarkdown>
              </div>
            );
          })}

          {loading && (
            <div className="flex w-fit items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Ai is thinking...
            </div>
          )}

          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <div className="border-t border-border bg-background px-4 pb-[max(env(safe-area-inset-bottom),1rem)] pt-3 sm:px-3 sm:pb-3">
        <div className="mb-3 flex gap-x-2 rounded-lg p-1">
          {(['build', 'chat'] as const).map((mode) => (
            <Badge
              key={mode}
              className={cn(
                'h-9 cursor-pointer rounded-md px-3 py-2 text-sm capitalize transition-colors',
                loading && 'pointer-events-none opacity-50',
              )}
              onClick={() => setType(mode)}
              variant={type === mode ? 'default' : 'outline'}>
              {mode}
            </Badge>
          ))}
        </div>

        <div className="relative w-full">
          <Textarea
            onChange={(e) => setText(e.target.value)}
            value={text}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            disabled={loading}
            className="min-h-24 max-h-48  resize-none rounded-lg pr-14 text-base sm:min-h-[125px] sm:text-sm"
            placeholder="Add a message..."
          />
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={loading || !text.trim()}
            size="icon"
            className="absolute bottom-3 right-3 size-10 rounded-full">
            <Send className="size-4" aria-hidden />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BoardAiChat;
