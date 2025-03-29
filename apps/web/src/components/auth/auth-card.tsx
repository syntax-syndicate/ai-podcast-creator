import Link from "next/link";

import { OAuthSignIn } from "@/components/auth/oauth-signin";

interface AuthCardProps {
  title: string;
  description: string;
  type: "signin" | "signup";
  children: React.ReactNode;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export function AuthCard({
  title,
  description,
  type,
  children,
  loading,
  setLoading,
}: AuthCardProps) {
  return (
    <div className="mt-6">
      <div className="relative isolate flex w-[25rem] max-w-[calc(-2.5rem+100vw)] flex-col flex-nowrap items-stretch justify-start overflow-hidden rounded-[0.75rem] text-[rgb(33,33,38)] shadow-[rgba(0,0,0,0.08)_0px_5px_15px_0px,_rgba(25,28,33,0.2)_0px_15px_35px_-5px,rgba(0,0,0,0.07)_0px_0px_0px_1px]">
        <div className="relative z-10 flex flex-col flex-nowrap items-stretch gap-8 rounded-[0.5rem] border-solid border-[rgba(0,0,0,0.03)] bg-white px-10 py-8 text-center shadow-[rgba(0,0,0,0.08)_0px_0px_2px_0px,_rgba(25,28,33,0.06)_0px_1px_2px_0px,rgba(0,0,0,0.03)_0px_0px_0px_1px] transition-all duration-200">
          <div className="flex flex-col flex-nowrap items-stretch justify-start gap-6">
            <div className="flex flex-col flex-nowrap items-stretch justify-start gap-1">
              <h1 className="m-0 text-[1.0625rem] font-bold leading-normal tracking-[normal] text-[rgb(33,33,38)]">
                {title}
              </h1>
              <p className="m-0 break-words text-[0.8125rem] font-normal leading-snug tracking-[normal] text-[rgb(116,118,134)]">
                {description}
              </p>
            </div>
          </div>
          <div className="flex flex-col flex-nowrap items-stretch justify-start gap-6">
            <OAuthSignIn loading={loading} setLoading={setLoading} />

            <div className="flex flex-row flex-nowrap items-center justify-center">
              <div className="flex h-px flex-1 flex-row items-stretch justify-start bg-[rgba(0,0,0,0.07)]"></div>
              <p className="mx-4 my-0 text-[0.8125rem] font-normal leading-snug tracking-normal text-[rgb(116,118,134)]">
                or
              </p>
              <div className="flex h-px flex-1 flex-row items-stretch justify-start bg-[rgba(0,0,0,0.07)]"></div>
            </div>

            {children}
          </div>
        </div>

        <div className="-mt-2 flex flex-col flex-nowrap items-center justify-center bg-[linear-gradient(rgba(0,0,0,0.03),rgba(0,0,0,0.03)),linear-gradient(rgb(255,255,255),rgb(255,255,255))] pt-2">
          <div className="m-auto flex flex-row flex-nowrap items-stretch justify-start gap-1 px-8 py-4">
            <span className="m-0 text-[0.8125rem] font-normal leading-snug tracking-normal text-[rgb(116,118,134)]">
              {type === "signin"
                ? "Don't have an account?"
                : "Already have an account?"}
            </span>
            <Link
              href={type === "signin" ? "/signup" : "/signin"}
              className="font-inherit m-0 inline-flex cursor-pointer items-center text-[0.8125rem] font-medium leading-snug tracking-normal text-[rgb(47,48,55)] no-underline"
            >
              {type === "signin" ? "Sign up" : "Sign in"}
            </Link>
          </div>
          <div className="relative isolate w-full border-t border-[rgba(0,0,0,0.07)] px-8 py-4">
            <div className="relative z-[1] mx-auto flex w-full flex-col items-center justify-center gap-2">
              <div className="flex w-full flex-row flex-nowrap items-stretch justify-center">
                <div className="flex flex-row items-center justify-center gap-1 text-[rgb(116,118,134)]">
                  <p className="font-inherit m-0 text-[0.75rem] font-medium leading-snug tracking-normal text-inherit">
                    Powered by Better Auth
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
