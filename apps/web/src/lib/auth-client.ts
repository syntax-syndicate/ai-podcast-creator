import { createAuthClient } from "better-auth/react";
import {
  customSessionClient,
  usernameClient,
} from "better-auth/client/plugins";

import { env } from "@/env";
import type { auth } from "./auth";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_APP_URL,
  plugins: [usernameClient(), customSessionClient<typeof auth>()],
});
