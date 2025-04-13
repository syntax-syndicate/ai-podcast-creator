import * as React from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { Editor } from "@/components/studio/editor";
import { EditorSkeleton } from "@/components/studio/editor.skeleton";
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
import { api, HydrateClient } from "@/trpc/server";
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
    const project = await api.project.getChaptersOrder({ projectId });
    const firstChapterId = project?.chaptersOrder?.[0];

    if (!firstChapterId) {
      redirect(`/studio/${projectId}/create-chapter`);
    }

    const searchParams = new URLSearchParams();
    searchParams.set("chapterId", firstChapterId);

    redirect(`/studio/${projectId}?${searchParams.toString()}`);
  }

  void api.chapter.getById.prefetch({ chapterId });

  return (
    <HydrateClient>
      <SidebarInset className="max-h-screen min-h-screen">
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
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

        <React.Suspense fallback={<EditorSkeleton />}>
          <Editor projectId={projectId} chapterId={chapterId} />
        </React.Suspense>
      </SidebarInset>
    </HydrateClient>
  );
}
