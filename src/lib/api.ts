import { env } from "@/lib/env";

export class CmsApiError extends Error {
  readonly status?: number;
  readonly cause?: unknown;

  constructor(message: string, options?: { status?: number; cause?: unknown }) {
    super(message);
    this.name = "CmsApiError";
    this.status = options?.status;
    this.cause = options?.cause;
  }
}

type RequestCmsOptions = {
  revalidate?: number;
  tags?: string[];
};

export async function requestCmsApi<T>(
  path: string,
  options?: RequestCmsOptions,
) {
  const response = await fetch(`${env.CMS_API_URL}${path}`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.CMS_API_KEY}`,
    },
    next: {
      revalidate: options?.revalidate,
      tags: options?.tags,
    },
  });

  let payload: T | { message?: string } | null = null;

  try {
    payload = (await response.json()) as T | { message?: string };
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const message =
      payload &&
      typeof payload === "object" &&
      "message" in payload &&
      typeof payload.message === "string"
        ? payload.message
        : `The CMS request failed for "${path}".`;

    throw new CmsApiError(message, {
      status: response.status,
      cause: payload,
    });
  }

  return payload as T;
}
