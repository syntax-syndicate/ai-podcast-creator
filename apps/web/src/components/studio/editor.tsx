"use client";

import * as React from "react";

import type { Block, Node } from "@/lib/db/schema";
import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/react";
import { usePlayerStore } from "@/hooks/use-player";
import { useDebounce } from "@/hooks/use-debounce";
import { useMounted } from "@/hooks/use-mounted";
import { EditorSkeleton } from "./editor.skeleton";
import { Button } from "@/components/ui/button";

interface EditorProps {
  projectId: string;
  chapterId: string;
}

export function Editor({ projectId, chapterId }: EditorProps) {
  const mounted = useMounted();

  const {
    data: chapter,
    isPending,
    isFetching,
  } = trpc.chapter.getById.useQuery({ chapterId });

  const exportAudio = trpc.chapter.exportAudio.useMutation({
    onSuccess: ({ audioUrl, filename }) => {
      const link = document.createElement("a");
      link.href = audioUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    onError: () => {},
  });

  const sortedBlocks = React.useMemo(() => {
    if (!chapter) return [];

    const orderMap = new Map(
      chapter.blocksOrder.map((id, index) => [id, index]),
    );

    return [...chapter.blocks].sort((a, b) => {
      const indexA = orderMap.get(a.id) ?? Infinity;
      const indexB = orderMap.get(b.id) ?? Infinity;
      return indexA - indexB;
    });
  }, [chapter]);

  function handleExportAudio() {
    exportAudio.mutate({ chapterId });
  }

  if (!mounted || isPending || !chapter) return <EditorSkeleton />;

  return (
    <div className="relative flex w-full flex-col">
      <div className="border-b py-2">
        <div className="mx-auto flex w-full max-w-4xl items-center gap-2">
          <Button onClick={handleExportAudio}>Export</Button>
          <Button>Generate all</Button>
        </div>
      </div>
      <div className="mx-auto w-full max-w-4xl">
        <div className="flex flex-col gap-2 py-8">
          <div className="flex items-center">
            {/* <Button>Generate all</Button> */}
          </div>
          <div className="flex flex-col gap-4">
            {sortedBlocks.map((block) => (
              <Block key={block.id} block={block} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Block({ block }: { block: Block & { children: Node[] } }) {
  const { playingBlockId, isPlaying, togglePlayback } = usePlayerStore();
  const isCurrentBlockPlaying = playingBlockId === block.id && isPlaying;

  const utils = trpc.useUtils();
  const generateSpeech = trpc.block.generateSpeech.useMutation({
    onSuccess: () => {
      utils.chapter.getById.invalidate({ chapterId: block.chapterId });
    },
  });

  const { data: chapter } = trpc.chapter.getById.useQuery({
    chapterId: block.chapterId,
  });

  function handlePlay() {
    if (!block.audioUrl) {
      generateSpeech.mutate({ blockId: block.id });
    } else {
      togglePlayback(block.id, block.audioUrl);
    }
  }

  return (
    <div className="relative flex items-center">
      <div className="absolute -left-24 top-0 flex flex-col items-start">
        <button
          className=""
          onClick={() => generateSpeech.mutate({ blockId: block.id })}
        >
          {generateSpeech.isPending
            ? "Generating"
            : block.isConverted
              ? "Regenerate"
              : "Generate"}
        </button>
        {block.audioUrl && (
          <button onClick={handlePlay}>
            {isCurrentBlockPlaying ? "Pause" : "Play"}
          </button>
        )}
      </div>

      <div className="flex w-full flex-wrap">
        {block.children.map((node) => (
          <NodeTextarea key={node.id} node={node} blockId={block.id} />
        ))}
      </div>
    </div>
  );
}

interface NodeTextareaProps {
  node: Node;
  blockId: string;
}

function NodeTextarea({ node, blockId }: NodeTextareaProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const [text, setText] = React.useState(node.text || "");
  const debouncedText = useDebounce(text, 500);
  const [isFocused, setIsFocused] = React.useState(false);

  const utils = trpc.useUtils();
  const updateNode = trpc.node.update.useMutation({
    onSuccess: () => {
      utils.chapter.getById.invalidate();
    },
  });

  React.useEffect(() => {
    if (debouncedText !== node.text) {
      updateNode.mutate({ id: node.id, text: debouncedText });
    }
  }, [debouncedText]);

  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

  return (
    <textarea
      ref={textareaRef}
      value={text}
      onChange={(e) => setText(e.target.value)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      rows={1}
      className={cn(
        "m-0 w-full resize-none overflow-hidden border-none bg-transparent p-0 focus:outline-none",
        isFocused && "bg-blue-50/10",
      )}
    />
  );
}
