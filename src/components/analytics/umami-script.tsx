import Script from "next/script";

import { env } from "@/lib/env";

function normalizeHostUrl(hostUrl: string) {
  return hostUrl.replace(/\/+$/, "");
}

export function UmamiScript() {
  if (!env.UMAMI_HOST_URL || !env.UMAMI_WEBSITE_ID) {
    return null;
  }

  return (
    <Script
      id="umami-analytics"
      src="/a/script.js"
      strategy="afterInteractive"
      data-website-id={env.UMAMI_WEBSITE_ID}
      data-host-url="/a"
      data-do-not-track="true"
      data-domains={typeof window === "undefined" ? undefined : undefined}
    />
  );
}

export function getUmamiScriptSource() {
  if (!env.UMAMI_HOST_URL) {
    throw new Error("UMAMI_HOST_URL is not configured.");
  }

  return `${normalizeHostUrl(env.UMAMI_HOST_URL)}/script.js`;
}

export function getUmamiSendEndpoint() {
  if (!env.UMAMI_HOST_URL) {
    throw new Error("UMAMI_HOST_URL is not configured.");
  }

  return `${normalizeHostUrl(env.UMAMI_HOST_URL)}/api/send`;
}
