"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form, FormControl } from "@/components/ui/form";
import { AuthCard } from "@/components/auth/auth-card";
import { Icons } from "@/components/icons";

const formSchema = z.object({});

interface SignInProps {
  callbackUrl?: string;
}

export function SignIn({ callbackUrl }: SignInProps) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  // const form = useForm<>({
  //   resolved: zodResolver()
  // })

  return (
    <AuthCard
      loading={loading}
      setLoading={setLoading}
      title="Sign in to Parallax Podcast"
      description="Welcome back! Please sign in to continue"
      callbackUrl={callbackUrl}
      type="signin"
    >
      <form className="flex flex-col flex-nowrap items-stretch justify-start gap-8">
        <div className="flex flex-col flex-nowrap items-stretch justify-center gap-6">
          <div className="flex flex-row flex-nowrap items-stretch justify-between gap-4">
            <div className="relative flex flex-[1_1_auto] flex-col items-stretch justify-start">
              <div className="flex flex-col flex-nowrap items-stretch justify-start gap-2">
                <div className="flex flex-row flex-nowrap items-center justify-between">
                  <label
                    htmlFor="identifier-field"
                    className="flex items-center text-[0.8125rem] font-medium leading-snug tracking-normal text-[rgb(33,33,38)]"
                  >
                    Email address or username
                  </label>
                </div>
                <input
                  className="better-auth-outline-focus better-auth-focus-no-outline better-auth-outline-hover m-0 aspect-auto max-h-9 w-full rounded-[0.375rem] border-0 border-[rgba(0,0,0,0.28)] bg-white px-3 py-1.5 text-[0.8125rem] font-normal leading-snug tracking-normal text-[rgb(19,19,22)] accent-[rgb(47,48,55)] shadow-[rgba(0,0,0,0.11)_0px_0px_0px_1px,rgba(0,0,0,0.07)_0px_0px_1px_0px] outline-2 outline-offset-2 transition-shadow duration-200 ease-in-out"
                  id="identifier-field"
                  placeholder="Enter email or username"
                  type="text"
                  disabled={loading}
                />
              </div>
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="better-auth-continue-button better-auth-outline-focus relative isolate m-0 inline-flex w-full cursor-pointer select-none items-center justify-center rounded-[0.375rem] border border-solid border-[#2F3037] bg-[#2F3037] px-3 py-1.5 text-[0.8125rem] font-medium leading-[1.38462] tracking-normal text-white shadow-[rgb(47,48,55)_0px_0px_0px_1px,rgba(255,255,255,0.07)_0px_1px_1px_0px_inset,rgba(34,42,53,0.2)_0px_2px_3px_0px,rgba(0,0,0,0.24)_0px_1px_1px_0px] outline-0 hover:bg-[#3B3C45]"
          disabled={loading}
        >
          <span className="flex flex-row flex-nowrap items-center justify-start">
            Continue
            <span className="ml-2 h-2.5 w-2.5 flex-shrink-0 opacity-60">
              <Icons.authContinue className="h-2.5 w-2.5" />
            </span>
          </span>
        </button>
      </form>
    </AuthCard>
  );
}
