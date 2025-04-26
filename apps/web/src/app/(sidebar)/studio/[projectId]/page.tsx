import * as React from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { Editor } from "@/components/studio/editor";
// import { AudioPlayer } from "@/components/audio-player";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { getSession } from "@/lib/auth";
import { trpc, HydrateClient } from "@/trpc/server";
import { loadSearchParams } from "./search-params";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { projectId } = await params;
  const { chapterId } = await loadSearchParams(searchParams);

  const session = await getSession({ headers: await headers() });

  if (!session) {
    redirect("/signin");
  }

  if (!chapterId) {
    const project = await trpc.project.getChaptersOrder({ projectId });
    const firstChapterId = project?.chaptersOrder?.[0];

    if (!firstChapterId) {
      redirect(`/studio/${projectId}/create-chapter`);
    }

    const searchParams = new URLSearchParams();
    searchParams.set("chapterId", firstChapterId);

    redirect(`/studio/${projectId}?${searchParams.toString()}`);
  }

  void trpc.chapter.getById.prefetch({ chapterId });

  return (
    <HydrateClient>
      <div className="relative h-screen w-screen">
        <header className="sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/studio">Studio</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <Editor projectId={projectId} chapterId={chapterId} />

        {/* <AudioPlayer /> */}
      </div>
    </HydrateClient>
  );
}
