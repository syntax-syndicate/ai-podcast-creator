import { cache } from "react";
// import { redirect } from "next/navigation";
import { polar } from "@polar-sh/better-auth";
import { Polar } from "@polar-sh/sdk";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { username, customSession } from "better-auth/plugins";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { env } from "@/env";

const polarClient = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
  server: "sandbox",
});

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      ...schema,
    },
    usePlural: true,
  }),
  plugins: [
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      enableCustomerPortal: true,
      checkout: {
        enabled: true,
        products: [
          {
            productId: "cb4e7dfd-70ba-4175-98f4-11f00f977a4d",
            slug: "pro",
          },
        ],
        successUrl: "/success?checkout_id={CHECKOUT_ID}",
      },
      // webhooks: {
      //   secret: env.POLAR_WEBHOOK_SECRET,
      // }
    }),
    username(),
    customSession(async ({ user, session }) => {
      const [foundUser] = await db
        .select({
          hasEarlyAccess: schema.earlyAccess.isEarlyAccess,
          earlyAccessId: schema.earlyAccess.id,
        })
        .from(schema.users)
        .leftJoin(
          schema.earlyAccess,
          eq(schema.users.email, schema.earlyAccess.email),
        )
        .where(eq(schema.users.id, user.id))
        .limit(1);

      // check early access
      if (
        !foundUser?.hasEarlyAccess &&
        process.env.NODE_ENV === "production" &&
        env.EARLY_ACCESS_ENABLED
      ) {
        // only insert if there's no existing record (earlyAccessId is undefined)
        if (foundUser?.earlyAccessId === undefined) {
          await db.insert(schema.earlyAccess).values({
            id: crypto.randomUUID(),
            email: user.email,
          });
        }

        // return redirect("/");
      }

      return {
        session,
        user,
      };
    }),
  ],
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day (every 1 day the session expiration is updated)
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  trustedOrigins: process.env.BETTER_AUTH_TRUSTED_ORIGIN?.split(",") ?? [],
});

export const getSession = cache(auth.api.getSession);
