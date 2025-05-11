"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Form, FormControl, FormField } from "@/components/ui/form";
import { AuthCard } from "@/components/auth/auth-card";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

const formSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

interface SignUpProps {
  callbackUrl?: string;
}

export function SignUp({ callbackUrl }: SignUpProps) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit({ email, password }: z.infer<typeof formSchema>) {
    await authClient.signUp.email(
      {
        email,
        password,
        name: email,
        callbackURL: callbackUrl ?? "/studio",
      },
      {
        onSuccess: () => {
          toast.success("Successfully signed up. Redirecting...");
        },
        onError: () => {
          toast.error("Something went wrong. Please try again.");
        },
      },
    );
  }
  return (
    <AuthCard
      loading={loading}
      setLoading={setLoading}
      title="Create an account"
      description="Welcome! Please fill in the details to get started."
      callbackUrl={callbackUrl}
      type="signup"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col flex-nowrap items-stretch justify-start gap-8"
        >
          <div className="flex flex-col flex-nowrap items-stretch justify-center gap-6">
            <div className="flex flex-row flex-nowrap items-stretch justify-between gap-4">
              <div className="relative flex flex-[1_1_auto] flex-col items-stretch justify-start">
                <div className="flex flex-col flex-nowrap items-stretch justify-start gap-2">
                  <div className="flex flex-row flex-nowrap items-center justify-between">
                    <label className="flex items-center text-[0.8125rem] font-medium leading-snug tracking-normal text-[rgb(33,33,38)]">
                      Email address or username
                    </label>
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <input
                        className="better-auth-outline-focus better-auth-focus-no-outline m-0 aspect-auto max-h-9 w-full rounded-[0.375rem] border-0 border-[rgba(0,0,0,0.28)] bg-white px-3 py-1.5 text-[0.8125rem] font-normal leading-snug tracking-normal text-[rgb(19,19,22)] accent-[rgb(47,48,55)] shadow-[rgba(0,0,0,0.11)_0px_0px_0px_1px,rgba(0,0,0,0.07)_0px_0px_1px_0px] outline-2 outline-offset-2 transition-shadow duration-200 ease-in-out"
                        placeholder="Enter email or username"
                        type="text"
                        disabled={loading}
                        {...field}
                      />
                    )}
                  />

                  <div className="mt-2 flex flex-row flex-nowrap items-center justify-between">
                    <label className="flex items-center text-[0.8125rem] font-medium leading-snug tracking-normal text-[rgb(33,33,38)]">
                      Password
                    </label>
                  </div>

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <input
                        className="better-auth-outline-focus better-auth-focus-no-outline m-0 aspect-auto max-h-9 w-full rounded-[0.375rem] border-0 border-[rgba(0,0,0,0.28)] bg-white px-3 py-1.5 text-[0.8125rem] font-normal leading-snug tracking-normal text-[rgb(19,19,22)] accent-[rgb(47,48,55)] shadow-[rgba(0,0,0,0.11)_0px_0px_0px_1px,rgba(0,0,0,0.07)_0px_0px_1px_0px] outline-2 outline-offset-2 transition-shadow duration-200 ease-in-out"
                        placeholder="Enter password"
                        type="password"
                        disabled={loading}
                        {...field}
                      />
                    )}
                  />

                  <div className="mt-2 flex flex-row flex-nowrap items-center justify-between">
                    <label className="flex items-center text-[0.8125rem] font-medium leading-snug tracking-normal text-[rgb(33,33,38)]">
                      Confirm Password
                    </label>
                  </div>

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <input
                        className="better-auth-outline-focus better-auth-focus-no-outline m-0 aspect-auto max-h-9 w-full rounded-[0.375rem] border-0 border-[rgba(0,0,0,0.28)] bg-white px-3 py-1.5 text-[0.8125rem] font-normal leading-snug tracking-normal text-[rgb(19,19,22)] accent-[rgb(47,48,55)] shadow-[rgba(0,0,0,0.11)_0px_0px_0px_1px,rgba(0,0,0,0.07)_0px_0px_1px_0px] outline-2 outline-offset-2 transition-shadow duration-200 ease-in-out"
                        placeholder="Confirm password"
                        type="password"
                        disabled={loading}
                        {...field}
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
          <Button
            type="submit"
            className="better-auth-continue-button better-auth-outline-focus"
            disabled={loading}
          >
            <span className="flex flex-row flex-nowrap items-center justify-start">
              Continue
            </span>
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
}
