"use client";

import * as React from "react";
import { useLocale } from "next-intl";
import { Check, Globe } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { availableLocales, type Locale } from "@/i18n/config";
import { changeLocale } from "@/i18n/utils";
import { cn } from "@/lib/utils";

export function LocaleSelector() {
  const currentLocale = useLocale() as Locale;
  const [open, setOpen] = React.useState(false);

  function handleLocaleSelect(localeCode: string) {
    changeLocale(localeCode as Locale);
    setOpen(false);
  }

  const selectedLocale = availableLocales.find(
    (locale) => locale.code === currentLocale,
  );

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground"
          aria-label="Select language"
        >
          <Globe className="size-4" />
          <span className="sr-only">
            {selectedLocale?.name || "Select language"}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[150px]" align="end">
        {availableLocales.map((locale) => (
          <DropdownMenuItem
            key={locale.code}
            onClick={() => handleLocaleSelect(locale.code)}
            className={cn(
              "flex cursor-pointer items-center gap-2",
              currentLocale === locale.code && "font-medium",
            )}
          >
            <span>{locale.name}</span>
            {currentLocale === locale.code && (
              <Check className="ml-auto h-4 w-4" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
