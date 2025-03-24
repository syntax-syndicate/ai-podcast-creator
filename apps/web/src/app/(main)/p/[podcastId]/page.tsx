import { PersonIcon } from "@radix-ui/react-icons";
// import { notFound } from "next/navigation";

// import { clerkClient } from "~/server/auth";
// import { getPodcast } from "~/server/queries/podcast";

type Params = { podcastId: string }

export default async function PodcastPage(
  {
    // params,
  }: {
    params: Params;
  },
) {
  // const { data: podcast } = await getPodcast({ id: params.podcastId });

  // if (!podcast) {
  //   notFound();
  // }

  // const user = await clerkClient.users.getUser(podcast.authorId);

  // fuck money, we for true art

  const user = {
    username: "iboughtbed",
  };

  return (
    <div className="container">
      <div className="flex flex-col">
        <div className="relative overflow-hidden pb-10 pt-8 md:pt-16">
          <div className="relative flex flex-col items-center">
            <div
              className="flex animate-fade-up flex-col md:flex-row"
              style={{ animationDelay: "0.10s", animationFillMode: "both" }}
            >
              <div className="flex items-center">
                <PersonIcon className="mr-2 size-4" />
                by <span className="ml-1 underline">{user.username}</span>
              </div>
            </div>

            <h1
              className="mt-3 animate-fade-up text-balance text-center text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1]"
              style={{ animationDelay: "0.20s", animationFillMode: "both" }}
            >
              The History of nFactorial Incubator
            </h1>
            <p
              className="mt-3 animate-fade-up text-balance text-center text-muted-foreground sm:text-lg"
              style={{ animationDelay: "0.30s", animationFillMode: "both" }}
            >
              How one of the largest incubators in Central Asia was created.
            </p>
          </div>
        </div>
        <div className="relative overflow-hidden pb-10 pt-8 md:pt-16">
          <div className="mx-auto w-full max-w-3xl">
            <audio controls className="w-full">
              <source src="https://utfs.io/f/c86322d2-a90d-4a2c-a9c4-6f01305a2b57-a7qu6k" />
            </audio>
          </div>
        </div>
      </div>
    </div>
  );
}
