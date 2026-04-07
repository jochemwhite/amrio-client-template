import { revalidatePath, revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";

import {
  CMS_LAYOUT_CACHE_TAG,
  CMS_PAGES_CACHE_TAG,
  getCmsPageCacheTag,
} from "@/lib/cms";
import { env } from "@/lib/env";

type RevalidateRequestBody = {
  path?: string;
  paths?: string[];
  prewarm?: boolean;
  revalidateLayout?: boolean;
  revalidateAll?: boolean;
};

const CMS_PAGE_ROUTE = "/[[...slug]]";

function isAuthorized(request: NextRequest, secret?: string | null) {
  const bearer = request.headers.get("authorization");
  const headerToken = request.headers.get("x-revalidate-secret");

  if (bearer?.startsWith("Bearer ")) {
    return bearer.slice("Bearer ".length) === secret;
  }

  return headerToken === secret;
}

function normalizePath(path: string) {
  if (!path.trim()) {
    return null;
  }

  return path.startsWith("/") ? path : `/${path}`;
}

function getCmsSlugFromPath(path: string) {
  return path === "/" ? "/" : path.replace(/^\/+/, "").replace(/\/+$/, "");
}

async function prewarmPath(origin: string, path: string) {
  const response = await fetch(new URL(path, origin), {
    cache: "no-store",
    headers: {
      "x-amrio-prewarm": "1",
    },
  });

  return {
    path,
    ok: response.ok,
    status: response.status,
  };
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request, env.REVALIDATE_SECRET)) {
    return Response.json({ ok: false, message: "Unauthorized." }, { status: 401 });
  }

  let body: RevalidateRequestBody = {};

  try {
    body = (await request.json()) as RevalidateRequestBody;
  } catch {
    body = {};
  }

  const requestedPaths = body.paths ?? (body.path ? [body.path] : []);
  const paths = requestedPaths
    .map(normalizePath)
    .filter((path): path is string => path != null);

  const revalidated: string[] = [];
  const prewarmed: Array<{ path: string; ok: boolean; status: number }> = [];

  if (body.revalidateAll) {
    revalidateTag(CMS_PAGES_CACHE_TAG, "max");
    revalidateTag(CMS_LAYOUT_CACHE_TAG, "max");
    revalidatePath("/", "layout");
    revalidatePath(CMS_PAGE_ROUTE, "page");
    revalidatePath(CMS_PAGE_ROUTE, "layout");
    revalidated.push(`tag:${CMS_PAGES_CACHE_TAG}`);
    revalidated.push(`tag:${CMS_LAYOUT_CACHE_TAG}`);
    revalidated.push("/");
    revalidated.push(`${CMS_PAGE_ROUTE} (page)`);
    revalidated.push(`${CMS_PAGE_ROUTE} (layout)`);
  } else {
    for (const path of paths) {
      const pageTag = getCmsPageCacheTag(getCmsSlugFromPath(path));

      revalidateTag(pageTag, "max");
      revalidatePath(path);
      revalidated.push(`tag:${pageTag}`);
      revalidated.push(path);
    }

    if (body.revalidateLayout) {
      revalidateTag(CMS_LAYOUT_CACHE_TAG, "max");
      revalidatePath("/", "layout");
      revalidated.push(`tag:${CMS_LAYOUT_CACHE_TAG}`);
      revalidated.push("/ (layout)");
    }
  }

  if (revalidated.length === 0) {
    return Response.json(
      {
        ok: false,
        message:
          "Provide `path`, `paths`, or set `revalidateAll` to `true`.",
      },
      { status: 400 },
    );
  }

  if (body.prewarm && !body.revalidateAll) {
    for (const path of paths) {
      prewarmed.push(await prewarmPath(request.nextUrl.origin, path));
    }
  }

  return Response.json({
    ok: true,
    revalidated,
    prewarmed,
    now: Date.now(),
  });
}
