import Link from "next/link";

import { Icons } from "@/components/icons";
import { MobileNav } from "@/components/mobile-nav";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

interface SiteHeaderProps {
  user: null;
}

export function SiteHeader({ user }: SiteHeaderProps) {
  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full py-5 backdrop-blur-lg">
      <div className="container relative flex h-8 items-center justify-between">
        <MobileNav items={siteConfig.mainNav} />

        <div className="hidden items-center gap-2 text-sm md:flex">
          {siteConfig.mainNav.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="hover:bg-accent hover:text-accent-foreground flex items-center justify-center rounded-3xl border border-current px-3 py-1 font-medium transition-colors"
            >
              {item.title}
            </Link>
          ))}
        </div>

        <Link
          href="/"
          className="absolute left-1/2 flex -translate-x-1/2 items-center justify-center py-3"
        >
          <Icons.logo />
        </Link>

        <div className="flex items-center gap-2 text-sm">
          <Link
            href={siteConfig.links.instagram}
            target="_blank"
            rel="noreferrer"
            className="hover:bg-accent hover:text-accent-foreground hidden items-center justify-center rounded-3xl border border-current px-3 py-1 font-medium transition-colors md:flex"
          >
            Instagram
          </Link>
          <Link
            href={siteConfig.links.instagram}
            target="_blank"
            rel="noreferrer"
            className="hover:bg-accent hover:text-accent-foreground hidden items-center justify-center rounded-3xl border border-current px-3 py-1 font-medium transition-colors md:flex"
          >
            Email
          </Link>
          {user ? (
            <></>
          ) : (
            <Link
              href="/signin"
              className={cn(
                buttonVariants({
                  size: "sm",
                }),
                "rounded-3xl text-sm",
              )}
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
