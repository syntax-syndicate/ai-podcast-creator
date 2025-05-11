import { getSubscription } from "@/lib/subscription";

export default async function Page() {
  const subscription = await getSubscription();

  if (!subscription) {
    return <div>No subscription found</div>;
  }

  return (
    <div className="flex flex-col gap-1">
      <p>{subscription.plan}</p>
      <p>{subscription.status}</p>
    </div>
  );
}
