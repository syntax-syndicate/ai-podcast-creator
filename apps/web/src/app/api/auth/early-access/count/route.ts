import { NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { count } from "drizzle-orm";

import { kv } from "@/lib/kv";
import { getIp } from "@/lib/ip";
import { db } from "@/lib/db";
import { earlyAccess } from "@/lib/db/schema";

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(20, "1m"),
  analytics: true,
  prefix: "ratelimit:early-access-count",
});

export async function GET(req: NextRequest) {
  try {
    const ip = await getIp();
    const { success } = await ratelimit.limit(ip);

    if (!success) {
      return NextResponse.json({ count: 0 }, { status: 200 });
    }

    const [result] = await db.select({ count: count() }).from(earlyAccess);

    return NextResponse.json({ count: result?.count ?? 0 }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ count: 0 }, { status: 400 });
  }
}
