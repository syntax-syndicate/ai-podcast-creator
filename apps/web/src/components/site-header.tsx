import Link from "next/link";
import { useTranslations } from "next-intl";

import { Icons } from "@/components/icons";
import { MobileNav } from "@/components/mobile-nav";
import { buttonVariants } from "@/components/ui/button";
import { ComingSoon } from "@/components/coming-soon";
import { siteConfig } from "@/config/site";
import type { Session } from "@/lib/auth-types";
import { cn } from "@/lib/utils";

interface SiteHeaderProps {
  user?: Session["user"];
}

export function SiteHeader({ user }: SiteHeaderProps) {
  const t = useTranslations("navigation.header");

  const items = siteConfig.mainNav.map((item) => ({
    title: t(item.key),
    href: item.href,
  }));

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 py-5 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
      <div className="container relative flex h-8 items-center justify-between">
        <MobileNav items={items} />

        <div className="hidden items-center gap-2 text-sm md:flex">
          {items.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="flex items-center justify-center rounded-3xl border border-current px-3 py-1 font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
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
            className="hidden items-center justify-center rounded-3xl border border-current px-3 py-1 font-medium transition-colors hover:bg-accent hover:text-accent-foreground md:flex"
          >
            Instagram
          </Link>
          <Link
            href={siteConfig.links.instagram}
            target="_blank"
            rel="noreferrer"
            className="hidden items-center justify-center rounded-3xl border border-current px-3 py-1 font-medium transition-colors hover:bg-accent hover:text-accent-foreground md:flex"
          >
            Email
          </Link>
          {user ? (
            <Link
              href="/studio"
              className={cn(
                buttonVariants({ size: "sm" }),
                "rounded-full text-sm",
              )}
            >
              {t("studio")}
            </Link>
          ) : (
            <ComingSoon />
          )}
        </div>
      </div>
    </header>
  );
}
