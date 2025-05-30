import { CreateProjectForm } from "./_components/create-project-form";

export default function Page() {
  return (
    <div>
      <div className="relative mb-4 flex items-center justify-center py-[26vh] pt-[18vh] text-gray-900 sm:pt-[18vh]">
        <div className="relative flex w-full flex-col items-center gap-6 px-6 text-center">
          <div className="flex w-full flex-col items-center gap-1.5">
            <h2
              className="text-4xl font-semibold tracking-tighter sm:text-5xl [@media(max-width:480px)]:text-[2rem]"
              data-testid="home-h2"
            >
              Generate. Tune. Inspire.
            </h2>
            <p>
              Generate podcasts with AI from simple
              <br className="sm:hidden" /> text prompts, documents and images.
            </p>
          </div>
          <div className="z-10 m-auto flex w-full flex-col divide-zinc-600 overflow-hidden rounded-xl bg-[rgb(24,24,27)] shadow-lg shadow-black/40 sm:max-w-xl">
            <CreateProjectForm />
          </div>
        </div>
      </div>
    </div>
  );
}
