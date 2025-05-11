import "server-only";

import { cache } from "react";
import { headers } from "next/headers";

import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export const getSubscription = cache(async () => {
  const session = await getSession({ headers: await headers() });

  if (!session?.user) {
    return null;
  }

  const subscription = await db.query.subscriptions.findFirst({
    where: (table, { eq }) => eq(table.userId, session.user.id),
    columns: {
      plan: true,
      status: true,
    },
  });

  return subscription;
});
