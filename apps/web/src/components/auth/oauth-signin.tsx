"use client";

import * as React from "react";
import { toast } from "sonner";

import { Icons } from "@/components/icons";
import { authClient } from "@/lib/auth-client";
import type { OAuthStrategy } from "@/lib/auth-types";

type ProviderProps = {
  name: string;
  icon: keyof typeof Icons;
  strategy: OAuthStrategy;
};

interface OAuthSignInProps {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export function OAuthSignIn({ loading, setLoading }: OAuthSignInProps) {
  const providers: ProviderProps[] = [
    { name: "GitHub", icon: "gitHub", strategy: "github" },
    { name: "Google", icon: "google", strategy: "google" },
  ];

  async function oauthSignin(provider: OAuthStrategy) {
    try {
      setLoading(true);
      await authClient.signIn.social({
        provider,
      });
    } catch {
      setLoading(false);
      toast.error("Something went wrong. Try again.");
    }
  }

  return (
    <div className="flex flex-col flex-nowrap items-stretch justify-start gap-2">
      <div className="grid grid-cols-2 items-stretch justify-center gap-2">
        {providers.map((provider, idx) => {
          const Icon = Icons[provider.icon];

          return (
            <button
              key={idx}
              className="better-auth-outline-focus better-auth-provider-button-hover relative isolate m-0 inline-flex w-full cursor-pointer select-none items-center justify-start gap-4 rounded-[0.375rem] border-0 border-solid border-[rgba(0,0,0,0.07)] bg-[unset] px-3 py-1.5 text-[0.8125rem] font-medium leading-snug tracking-[normal] text-[rgba(0,0,0,0.62)] shadow-[rgba(0,0,0,0.07)_0px_0px_0px_1px,_rgba(0,0,0,0.08)_0px_2px_3px_-1px,rgba(0,0,0,0.02)_0px_1px_0px_0px] outline-0 transition-all duration-100"
              onClick={() => void oauthSignin(provider.strategy)}
              disabled={loading}
            >
              <span className="flex w-full flex-row flex-nowrap items-center justify-center gap-3 overflow-hidden">
                <span className="flex flex-shrink-0 flex-grow-0 basis-4 flex-row flex-nowrap items-center justify-center">
                  <Icon className="h-auto w-4 max-w-full" />
                </span>
                <span className="m-0 overflow-hidden truncate whitespace-nowrap text-[0.8125rem] font-medium leading-snug tracking-normal text-inherit">
                  {provider.name}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
