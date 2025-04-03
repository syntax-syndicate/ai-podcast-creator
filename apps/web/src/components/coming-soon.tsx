"use client";

import { toast } from "sonner";
import { useTranslations } from "next-intl";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ComingSoon() {
  const t = useTranslations("navigation.header");

  return (
    <button
      // href="/signin"
      className={cn(
        buttonVariants({
          size: "sm",
        }),
        "rounded-3xl text-sm",
      )}
      onClick={() => {
        toast.info("Launching soon.");
      }}
    >
      {t("signIn")}
    </button>
  );
}
