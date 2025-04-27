import { NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { earlyAccess } from "@/lib/db/schema";
import { getIp } from "@/lib/ip";
import { kv } from "@/lib/kv";

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(2, "1m"),
  analytics: true,
  prefix: "ratelimit:early-access-count",
});

function isEmail(email: string): boolean {
  if (!email) {
    return false;
  }

  const emailRegex = new RegExp(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  );

  return emailRegex.test(email);
}

export async function POST(req: NextRequest) {
  try {
    const ip = await getIp();
    const { success, limit, remaining, reset } = await ratelimit.limit(ip);

    const headers = {
      "X-RateLimit-Limit": limit.toString(),
      "X-RateLimit-Remaining": remaining.toString(),
      "X-RateLimit-Reset": reset.toString(),
    };

    if (!success) {
      console.log("Rate limit exceeded");
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429, headers },
      );
    }

    const { email: _email } = (await req.json()) as { email: string };

    const email = _email.trim().toLowerCase();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    if (!isEmail(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 },
      );
    }

    const [existingEarlyAccess] = await db
      .select({ id: earlyAccess.id })
      .from(earlyAccess)
      .where(eq(earlyAccess.email, email))
      .limit(1);

    if (existingEarlyAccess) {
      return NextResponse.json(
        { error: "Email already in waitlist" },
        { status: 200 },
      );
    } else {
      await db.insert(earlyAccess).values({
        id: crypto.randomUUID(),
        email,
      });

      return NextResponse.json(
        { message: "Successfully joined waitlist" },
        { status: 201, headers },
      );
    }
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
