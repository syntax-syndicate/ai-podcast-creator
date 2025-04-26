"use client";

import * as React from "react";
import Link from "next/link";
import { keepPreviousData } from "@tanstack/react-query";
import { MoreVertical, FileVolume, Download } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { trpc } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";
import { StudioSkeleton } from "./studio.skeleton";

export function Studio() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const debouncedSearch = useDebounce(searchQuery);

  const projects = trpc.project.get.useQuery(
    {
      search: debouncedSearch,
    },
    {
      placeholderData: keepPreviousData,
    },
  );

  function handleDownload(audioUrl: string, filename: string) {
    const link = document.createElement("a");
    link.href = audioUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  if (projects.isPending) return <StudioSkeleton />;

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="flex flex-col">
        <div className="py-8">
          <h1 className="text-2xl font-bold">Studio</h1>
          <p className="text-muted-foreground">
            Generate, edit transcripts, and clone voices.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <Input
            placeholder="Search your projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div
            className={cn("flex flex-col gap-4 transition-opacity", {
              "opacity-50": projects.isFetching,
            })}
          >
            {projects.data?.map((project) => (
              <div
                key={project.id}
                className="relative flex items-center justify-between rounded-lg"
              >
                {project.projectStatus === "generating" ? (
                  <button
                    className="absolute inset-0"
                    onClick={() => toast.warning("Project is generating")}
                  ></button>
                ) : (
                  <Link
                    href={`/studio/${project.id}`}
                    className="absolute inset-0"
                  ></Link>
                )}

                <div className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-md bg-muted">
                    <FileVolume className="size-6" />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-sm font-medium">{project.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      Last edited{" "}
                      {project.updatedAt &&
                        formatDistanceToNow(new Date(project.updatedAt), {
                          addSuffix: true,
                        })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {project.chapters[0]?.audioUrl && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative"
                      onClick={() =>
                        handleDownload(
                          project.chapters[0]?.audioUrl as string,
                          `${project.chapters[0]?.id}.mp3`,
                        )
                      }
                    >
                      <Download className="size-4" />
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" className="relative">
                    <MoreVertical className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
