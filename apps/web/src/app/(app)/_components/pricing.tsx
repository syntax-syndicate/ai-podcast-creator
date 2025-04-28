import Link from "next/link";
import { useTranslations } from "next-intl";
import { Check } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export function Pricing() {
  const t = useTranslations("pages.home");

  const freeFeatures = [
    "1 project",
    "10,000 audio credits (10 minutes) / month",
    "Generate from documents & text",
    "Download project audio (mp3)",
    "Studio with Editor",
  ];
  const proFeatures = [
    "Unlimited projects",
    "60,000 audio credits (60 minutes) / month",
    "Generate from documents, text, images and web search",
    "Clone your own voices",
    "Distribution to Spotify, Apple Podcast & others",
    "AI completions for podcast scripts",
    "Generate audiobooks and audio articles",
  ];

  return (
    <div className="mx-auto mb-20 w-full max-w-4xl pb-10 pt-20">
      <div className="text-center">
        <h2 className="text-sm font-medium text-violet-500">Pricing</h2>
        <p className="mx-auto mt-4 max-w-md text-balance text-3xl font-semibold tracking-[-0.015rem] text-gray-950">
          Choose your plan
        </p>
        <p className="mx-auto mt-4 max-w-xl text-base/6 text-gray-600">
          Find the perfect fit for your studio-quality audio creation needs
        </p>
      </div>

      <div className="relative mt-16 w-full">
        <div className="isolate grid w-full grid-cols-1 gap-6 md:grid-cols-2">
          <div className="z-10 flex rounded-xl shadow-md ring-1 ring-gray-950/5">
            <div className="flex w-full flex-col items-start py-8">
              <div className="flex flex-wrap px-8">
                <span className="w-full flex-none font-medium text-gray-950">
                  Free Plan
                </span>
                <span className="mt-0.5 w-full text-sm text-gray-600">
                  Everything you need to start.
                </span>
              </div>

              <Separator className="mb-4 mt-8" />

              <div className="mt-4 flex w-full flex-col gap-4 px-8">
                <div>
                  <span className="text-4xl tabular-nums">$0</span> / month
                </div>
                <Link
                  href="/signin"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "w-full",
                  )}
                >
                  Start for Free
                </Link>
              </div>
              <div className="mb-8 mt-8 flex w-full flex-col gap-2 px-8">
                <span className="text-muted-foreground">
                  What&apos;s included:
                </span>
                <div className="flex flex-col gap-1">
                  {freeFeatures.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-1">
                      <div className="flex size-6 shrink-0 items-center justify-center rounded-lg">
                        <Check className="size-4" />
                      </div>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="z-10 flex rounded-xl border shadow-2xl">
            <div className="flex w-full flex-col items-start py-8">
              <div className="flex flex-wrap px-8">
                <span className="w-full flex-none font-medium text-gray-950">
                  Pro Plan
                </span>
                <span className="mt-0.5 w-full text-sm text-gray-600">
                  Everything you need to start.
                </span>
              </div>

              <Separator className="mb-4 mt-8" />

              <div className="mt-4 flex w-full flex-col gap-4 px-8">
                <div>
                  <span className="text-4xl tabular-nums">$20</span> / month
                </div>
                <Link
                  href="/signin?callbackUrl=/api/auth/checkout/pro"
                  className={cn(
                    buttonVariants(),
                    "w-full bg-violet-600 hover:bg-violet-600/90",
                  )}
                >
                  Get Started with Pro
                </Link>
              </div>
              <div className="mb-8 mt-8 flex w-full flex-col gap-2 px-8">
                <span className="text-muted-foreground">
                  What&apos;s included:
                </span>
                <div className="flex flex-col gap-1">
                  {proFeatures.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-1">
                      <div className="flex size-6 shrink-0 items-center justify-center rounded-lg">
                        <Check className="size-4 text-violet-500" />
                      </div>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
