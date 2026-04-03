import axios, { AxiosError } from "axios";

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

export const api = axios.create({
  baseURL: env.CMS_API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${env.CMS_API_KEY}`,
  },
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.message ??
      error.message ??
      "The CMS request failed.";

    return Promise.reject(
      new CmsApiError(message, {
        status,
        cause: error,
      }),
    );
  },
);
