import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getSession } from "@/lib/auth";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession({ headers: await headers() });

  if (!session) {
    redirect("/signin");
  }

  return (
    <SidebarProvider>
      <AppSidebar user={session?.user} />
      {children}
    </SidebarProvider>
  );
}
