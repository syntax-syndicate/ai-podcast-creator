"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import confetti from "canvas-confetti";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AnimatedNumber } from "@/components/animated-number";

const formSchema = z.object({
  email: z.string().email(),
});

export function EarlyAccessForm() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [signupCount, setSignupCount] = React.useState(0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  React.useEffect(() => {
    async function _fetch() {
      try {
        const response = await fetch("/api/auth/early-access/count");
        const { count } = (await response.json()) as { count: number };
        setSignupCount(count);
      } catch {
        console.error("Failed to fetch waitlist count");
      }
    }

    _fetch();
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/early-access", {
        method: "POST",
        body: JSON.stringify(values),
      });

      toast.success("Successfully joined waitlist");
      confetti({
        particleCount: 200,
        spread: 150,
        origin: { y: -0.2, x: 0.5 },
        angle: 270,
      });
      setIsSuccess(true);

      if (response.status === 201 && signupCount !== null) {
        setSignupCount(signupCount + 1);
      }

      setIsLoading(false);
    } catch {
      toast.error("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {isSuccess ? (
          <p className="h-9">
            You're on the list. We'll notify you when we launch.
          </p>
        ) : (
          <div className="mb-2 flex items-center gap-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      className="h-9 md:w-80"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              Join waitlist
            </Button>
          </div>
        )}

        <p className="text-center text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">
            <AnimatedNumber
              springOptions={{
                bounce: 0,
                duration: 2000,
              }}
              value={signupCount}
            />
          </span>{" "}
          people have already joined the waitlist
        </p>
      </form>
    </Form>
  );
}
