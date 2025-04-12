import * as React from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { Studio } from "@/components/studio";
import { StudioSkeleton } from "@/components/studio.skeleton";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { getSession } from "@/lib/auth";
import { api, HydrateClient } from "@/trpc/server";

export default async function Page() {
  const session = await getSession({ headers: await headers() });

  if (!session) {
    redirect("/signin");
  }

  void api.project.get.prefetch();

  return (
    <HydrateClient>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Studio</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <React.Suspense fallback={<StudioSkeleton />}>
          <Studio />
        </React.Suspense>
      </SidebarInset>
    </HydrateClient>
  );
}
