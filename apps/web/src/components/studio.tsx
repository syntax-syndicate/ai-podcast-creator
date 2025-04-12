"use client";

import { MoreVertical, FileVolume } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";

export function Studio() {
  const [data] = api.project.get.useSuspenseQuery();

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
          {data.map((project) => (
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
              <Button variant="ghost" size="icon" className="relative">
                <MoreVertical className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
