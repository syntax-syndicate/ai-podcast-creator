import { ChevronLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { SignIn } from "@/components/auth/sign-in";
import { cn } from "@/lib/utils";
import { loadSearchParams } from "../search-params";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { callbackUrl } = await loadSearchParams(searchParams);

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute left-4 top-4 md:left-8 md:top-8",
        )}
      >
        <>
          <ChevronLeftIcon className="mr-2 h-4 w-4" />
          Back
        </>
      </Link>
      <div className="mx-auto flex w-full max-w-sm flex-col justify-center space-y-6">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email to sign in to your account
          </p>
        </div>
        <SignIn callbackUrl={callbackUrl ?? undefined} />
      </div>
    </div>
  );
}
