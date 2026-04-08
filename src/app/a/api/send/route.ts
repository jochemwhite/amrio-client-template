import type { NextRequest } from "next/server";

import { getUmamiSendEndpoint } from "@/components/analytics/umami-script";

export async function POST(request: NextRequest) {
  const body = await request.text();

  const response = await fetch(getUmamiSendEndpoint(), {
    method: "POST",
    headers: {
      "content-type":
        request.headers.get("content-type") ?? "application/json",
      "user-agent": request.headers.get("user-agent") ?? "Next.js Umami Proxy",
      "x-forwarded-for": request.headers.get("x-forwarded-for") ?? "",
      "x-real-ip": request.headers.get("x-real-ip") ?? "",
    },
    body,
    cache: "no-store",
  });

  return new Response(await response.text(), {
    status: response.status,
    headers: {
      "Content-Type":
        response.headers.get("content-type") ?? "application/json; charset=utf-8",
    },
  });
}
