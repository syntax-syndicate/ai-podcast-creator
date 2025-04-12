"use client";

import { api } from "@/trpc/react";

interface EditorProps {
  projectId: string;
  chapterId: string;
}

export function Editor({ projectId, chapterId }: EditorProps) {
  const [chapter] = api.chapter.getById.useSuspenseQuery({ chapterId });

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="flex flex-col py-16">
        <div className="flex flex-col gap-2">
          {chapter.blocks.map((block) => (
            <div key={block.id} className="flex items-center">
              {block.children.map((node) => (
                <span key={node.id}>{node.text}</span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
