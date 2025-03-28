import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default async function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader user={null} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
