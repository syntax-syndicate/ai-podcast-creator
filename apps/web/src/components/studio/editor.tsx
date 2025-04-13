"use client";

import * as React from "react";

import type { Block, Node } from "@/lib/db/schema";
import { api } from "@/trpc/react";

interface EditorProps {
  projectId: string;
  chapterId: string;
}

export function Editor({ projectId, chapterId }: EditorProps) {
  const [chapter] = api.chapter.getById.useSuspenseQuery({ chapterId });

  // Create a map of blocks by ID for efficient lookup
  const blocksMap = new Map(chapter.blocks.map((block) => [block.id, block]));

  // Sort blocks according to chapter.blocksOrder
  const sortedBlocks = chapter.blocksOrder
    .map((blockId) => blocksMap.get(blockId))
    .filter(Boolean) as (Block & { children: Node[] })[];

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="flex flex-col py-16">
        <div className="flex flex-col gap-4">
          {sortedBlocks.map((block) => (
            <Block key={block.id} block={block} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Block({ block }: { block: Block & { children: Node[] } }) {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [audio, setAudio] = React.useState<HTMLAudioElement | null>(null);

  React.useEffect(() => {
    setAudio(new Audio());
  }, []);

  const generateSpeech = api.block.generateSpeech.useMutation();

  function handleClick() {
    generateSpeech.mutate({ blockId: block.id });
  }

  async function handlePlayPause() {
    if (!block.audioUrl || !audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.src = block.audioUrl;
      await audio.play();
    }
    setIsPlaying(!isPlaying);
  }

  React.useEffect(() => {
    if (!audio) return;

    const handleEnded = () => setIsPlaying(false);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.pause();
    };
  }, [audio]);

  return (
    <div className="relative flex items-center">
      <div className="absolute -left-24 top-0 flex flex-col items-start">
        <button className="" onClick={handleClick}>
          {generateSpeech.isPending
            ? "Generating"
            : block.isConverted
              ? "Regenerate"
              : "Generate"}
        </button>
        {block.audioUrl && (
          <button onClick={handlePlayPause}>
            {isPlaying ? "Pause" : "Play"}
          </button>
        )}
      </div>

      {block.children.map((node) => (
        <span key={node.id}>{node.text}</span>
      ))}
    </div>
  );
}
