"use client";

import Image from "next/image";
import Link from "next/link";
import { TypeAnimation } from "react-type-animation";
import { useTranslations } from "next-intl";

import { Icons } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Benefits() {
  const t = useTranslations("pages.home");

  return (
    <div className="relative mx-auto min-h-screen w-full max-w-5xl pb-10 pt-20 md:pt-40">
      <div className="mb-8 mr-auto max-w-4xl md:w-1/2">
        <h2 className="mb-4 text-4xl font-bold">
          <span className="relative md:p-4">
            <Image
              src="/images/title-highlight.png"
              alt="highlight"
              className="pointer-events-none absolute bottom-[-10px] left-[-10px] hidden select-none md:block"
              fill
            />
            {t("benefits.title.highlighted")}
          </span>{" "}
          {t("benefits.title.rest")}
        </h2>
        <p className="text-muted-foreground text-balance text-xl font-medium">
          {t("benefits.description")}
        </p>
      </div>
      <div className="flex flex-col gap-4 md:flex-row lg:gap-8">
        <div className="overflow-hidden rounded-xl border shadow-lg md:basis-3/5">
          <div className="p-8">
            <Icons.bot className="mb-4 size-6 text-violet-600" />
            <h3 className="text-lg font-extrabold">
              {t("benefits.aiGenerated.title")}
            </h3>
            <p className="text-muted-foreground mb-8">
              {t("benefits.aiGenerated.description")}
            </p>
            <Image
              src="/images/pink-arrow.png"
              alt="Pink arrow"
              className="ml-9"
              width="100"
              height="107"
            />
          </div>

          <div className="ml-[calc(20%)] w-full overflow-hidden rounded-xl border shadow-lg">
            <div className="flex items-center justify-between border-b">
              <div className="flex items-center p-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-muted mr-2 size-3 rounded-full"
                  ></div>
                ))}
              </div>
            </div>
            <div className="flex overflow-hidden">
              <div className="aspect-square h-[300px] p-8">
                Soon an interactive frame will be added
              </div>
            </div>
          </div>
        </div>

        <div className="md:basis-2/5">
          <div className="relative flex flex-col">
            <div className="relative flex flex-col gap-8">
              <div className="rounded-xl border p-8 shadow-lg">
                <Icons.rss className="mb-4 size-6 text-violet-600" />
                <h3 className="mb-2 text-lg font-extrabold">
                  {t("benefits.dailyNews.title")}
                </h3>
                <p className="text-muted-foreground mb-8">
                  {t("benefits.dailyNews.description")}
                </p>
                <Link
                  href="/episodes"
                  className={cn(
                    buttonVariants(),
                    "w-full bg-violet-600 hover:bg-violet-600/90 dark:text-white",
                  )}
                >
                  {t("listenNow")}
                </Link>
              </div>

              <div className="rounded-xl border p-8 shadow-lg">
                <Icons.link className="mb-4 size-6 text-violet-600" />
                <h3 className="mb-2 text-lg font-extrabold">
                  {t("benefits.shareLinks.title")}
                </h3>
                <p className="text-muted-foreground mb-8">
                  {t("benefits.shareLinks.description")}
                </p>
                <div className="bg-muted inline-flex w-full items-center justify-between rounded-md px-2 py-1 text-sm">
                  <div></div>
                  <div>prllx.studio/p/b7c29f</div>
                  <div>
                    <Link href="/p/b7c29f">
                      <Icons.externalLink className="text-muted-foreground size-4" />
                    </Link>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border bg-violet-600 p-8 text-white shadow-lg">
                <Icons.terminal className="mb-4 size-6" />
                <h3 className="mb-2 text-lg font-extrabold">
                  {t("benefits.customPrompts.title")}
                </h3>
                <p className="mb-8 text-white/80">
                  {t("benefits.customPrompts.description")}
                </p>
                <div className="bg-muted inline-flex w-full items-center justify-between rounded-md px-2 py-1 text-sm text-black">
                  <div></div>
                  <div className="flex-1">
                    <TypeAnimation
                      sequence={[
                        "Podcast about Artificial Intelligence",
                        1000,
                        "Podcast about Arman Suleimenov",
                        200,
                        "Podcast about Elon Musk",
                        200,
                      ]}
                      repeat={Infinity}
                    />
                  </div>
                  <div>
                    <Link href="/create">
                      <Icons.send className="text-muted-foreground size-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
