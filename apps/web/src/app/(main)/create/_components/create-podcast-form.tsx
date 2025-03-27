"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { createPodcast } from "@/actions/podcast";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";

export function CreatePodcastForm() {
  const router = useRouter();
  const [value, setValue] = React.useState("");
  const [files, setFiles] = React.useState<File[]>([]);
  const [searchEnabled, setSearchEnabled] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  async function onSubmit() {
    // return toast.info("The project has been discontinued.");

    try {
      setIsLoading(true);

      // const { data, error } = await createPodcast({
      //   prompt: value,
      //   files: files,
      //   searchEnabled: searchEnabled,
      // });

      // if (!data) {
      //   setIsLoading(false);
      //   return toast.error("Error creating the podcast, please try again");
      // }

      setIsLoading(false);
      toast.success("Redirecting...");
      // if (!data) {
      //   return toast.error("Error creating the podcast, please try again");
      // }

      // router.push(`/p/${data.id}`);
    } catch (err) {
      toast.error("Something went wrong");
      setIsLoading(false);
    }
  }

  async function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.length >= 2) {
        await onSubmit();
      }
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      if (e.target.files.length > 2) {
        toast.error("You can only upload up to 2 files");
        return;
      }

      const allowedFiles = Array.from(e.target.files).filter((file) => {
        const isValid =
          file.type.startsWith("image/") ||
          file.type === "application/pdf" ||
          file.type === "text/plain";

        if (!isValid) {
          toast.error(`Please upload only images, PDFs, or text files.`);
        }

        return isValid;
      });

      if (allowedFiles.length > 2) {
        toast.error("You can only upload up to 2 files");
        return;
      }

      setFiles(allowedFiles);
    }
  }

  const adjustHeight = React.useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "23px";
      const scrollHeight = textarea.scrollHeight;
      const maxHeight = 184;
      textarea.style.height =
        scrollHeight > 24
          ? `${Math.min(scrollHeight, maxHeight)}px`
          : "23px !important";
    }
  }, []);

  React.useEffect(() => {
    adjustHeight();
  }, [value, adjustHeight]);

  return (
    <div className="z-10 m-auto flex w-full flex-col divide-zinc-600 overflow-hidden rounded-xl bg-[rgb(24,24,27)] shadow-lg shadow-black/40 sm:max-w-xl">
      {/* <div className="relative rounded-t-xl text-gray-600">
        <div className="h-16 overflow-hidden [scrollbar-width:none]">
          <div className="flex items-center gap-3 overflow-x-auto p-3 transition-opacity">
            <div className="relative h-10 w-[150px] shrink-0"></div>
          </div>  
        </div>
      </div> */}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await onSubmit();
        }}
        className="relative z-10 h-full w-full min-w-0 bg-zinc-900 py-3"
      >
        <div className="relative flex w-full flex-1 flex-col items-center gap-6 transition-all duration-300">
          <label className="sr-only" htmlFor="textarea-input">
            prompt
          </label>
          <div className="relative flex w-full min-w-0 flex-1 justify-between self-start pl-3">
            <textarea
              ref={textareaRef}
              value={value}
              onKeyDown={onKeyDown}
              onChange={(e) => setValue(e.target.value)}
              className="mr-2 w-full flex-[1_0_50%] resize-none border-0 bg-transparent pl-1 pr-10 text-sm leading-relaxed text-white shadow-none outline-none ring-0 [scroll-padding-block:0.75rem] selection:bg-teal-300 selection:text-black placeholder:text-zinc-400 disabled:bg-transparent disabled:opacity-80 [&_textarea]:px-0"
              maxLength={1000}
              minLength={2}
              autoFocus
              style={{
                colorScheme: "dark",
                height: "23px",
                scrollbarWidth: "thin",
              }}
              placeholder="A podcast about why are people afraid of change"
              spellCheck={false}
              disabled={isLoading}
            ></textarea>
          </div>
          <div className="flex w-full justify-between gap-2 px-3">
            <div className="flex flex-1 gap-1 sm:gap-2">
              <button
                type="button"
                className={cn(
                  "focus-visible:ring-ring flex h-8 w-fit shrink-0 select-none items-center justify-center gap-2 whitespace-nowrap rounded-md px-2 py-2 text-sm font-medium text-white/70 transition-colors hover:bg-zinc-700/70 focus-visible:bg-zinc-800 focus-visible:outline-none focus-visible:ring-0 disabled:pointer-events-none disabled:opacity-50 sm:w-24 sm:px-3",
                  searchEnabled && "bg-zinc-700/70 text-white",
                )}
                onClick={() => {
                  setSearchEnabled(!searchEnabled);
                }}
              >
                <div className="flex items-center gap-1.5 focus-within:bg-zinc-700">
                  <Icons.search className="h-4 w-4 shrink-0 translate-x-[1px] sm:translate-x-[-1px]" />
                  <div>Search</div>
                </div>
              </button>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <input
                type="file"
                id="file-upload"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                multiple
                accept=".pdf,.txt,image/*"
                max="2"
              />
              <button
                id="attachment-button"
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="focus-visible:ring-ring flex h-8 w-8 shrink-0 items-center justify-center whitespace-nowrap rounded-md bg-transparent text-sm font-medium text-white transition-colors hover:bg-zinc-800 focus-visible:bg-zinc-800 focus-visible:outline-none focus-visible:ring-0 disabled:pointer-events-none disabled:opacity-50"
              >
                <span className="sr-only">Add files</span>
                <Icons.attachment className="size-4 text-white" />
              </button>
              <div className={cn(value.length < 2 && "cursor-not-allowed")}>
                <button
                  className="focus-visible:ring-ring flex h-8 w-8 shrink-0 items-center justify-center whitespace-nowrap rounded-md bg-transparent text-sm font-medium text-white transition-colors hover:bg-zinc-800 focus-visible:bg-zinc-800 focus-visible:outline-none focus-visible:ring-0 disabled:pointer-events-none disabled:opacity-50"
                  id="send-button"
                  type="submit"
                  disabled={value.length < 2 || isLoading}
                >
                  <span className="sr-only">Send</span>
                  <Icons.arrowRight className="size-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
