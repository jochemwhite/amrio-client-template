import { getUmamiScriptSource } from "@/components/analytics/umami-script";

export async function GET() {
  const response = await fetch(getUmamiScriptSource(), {
    cache: "no-store",
  });

  const body = await response.text();

  return new Response(body, {
    status: response.status,
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
      "Content-Type":
        response.headers.get("content-type") ?? "application/javascript; charset=utf-8",
    },
  });
}
