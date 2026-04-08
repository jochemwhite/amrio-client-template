# Next.js CMS Starter

Reusable internal starter for CMS-driven client websites built with:

- Next.js App Router
- TypeScript
- Axios
- Server Components by default
- Typed CMS service helpers

## Setup

1. Copy `.env.example` to `.env.local`.
2. Set `CMS_API_URL` to your CMS base URL.
3. Set `WEBSITE_ID` to the website identifier for the current client.
4. Set `CMS_API_KEY` and `REVALIDATE_SECRET`.
5. Optionally set `UMAMI_HOST_URL` and `UMAMI_WEBSITE_ID` to enable analytics.
4. Start the app with `bun dev`.

```env
CMS_API_URL=http://localhost:8000/api/cms
WEBSITE_ID=your-website-id
CMS_API_KEY=your-cms-api-key
REVALIDATE_SECRET=your-long-random-secret
UMAMI_HOST_URL=https://umami.amrio.nl
UMAMI_WEBSITE_ID=your-umami-website-id
```

## Folder structure

```txt
src/
  app/
    [...slug]/page.tsx
    collections/[prefixSlug]/[entrySlug]/page.tsx
  components/cms/content-renderer.tsx
  lib/
    api.ts
    cms.ts
    cms-routes.ts
    env.ts
  types/
    cms.ts
```

## What lives where

- Env handling: `src/lib/env.ts`
- Axios setup and API errors: `src/lib/api.ts`
- CMS endpoint helpers: `src/lib/cms.ts`
- CMS response/types: `src/types/cms.ts`
- Reusable route helpers: `src/lib/cms-routes.ts`
- Minimal CMS rendering placeholders: `src/components/cms/content-renderer.tsx`

## CMS endpoints already wired

- `getPages()`
- `getPageById(pageId)`
- `getPageBySlug(slug)`
- `getFullPageBySlug(slug)`
- `getCollectionEntry(prefixSlug, entrySlug)`

Each helper automatically injects the configured website ID, unwraps `{ success, data }`, and throws a typed error when the CMS response fails.

## Routes included

- CMS pages: `src/app/[...slug]/page.tsx`
- Collection entries: `src/app/collections/[prefixSlug]/[entrySlug]/page.tsx`

These routes use server components, `generateMetadata()`, `notFound()`, and a simple `revalidate = 60` strategy that you can adjust per route.

## ISR

CMS routes now use route-level ISR with a 1 hour revalidation window:

- `src/app/[[...slug]]/page.tsx`
- `src/app/[[...slug]]/layout.tsx`

That means published CMS content will refresh automatically at most once per hour in production.

### On-demand revalidation

There is also an authenticated route handler at `POST /api/revalidate`.

Authenticate with either:

- `Authorization: Bearer <REVALIDATE_SECRET>`
- `x-revalidate-secret: <REVALIDATE_SECRET>`

Examples:

```bash
curl -X POST http://localhost:3000/api/revalidate \
  -H "Authorization: Bearer your-long-random-secret" \
  -H "Content-Type: application/json" \
  -d '{"path":"/about"}'
```

```bash
curl -X POST http://localhost:3000/api/revalidate \
  -H "Authorization: Bearer your-long-random-secret" \
  -H "Content-Type: application/json" \
  -d '{"paths":["/","/contact"],"revalidateLayout":true}'
```

```bash
curl -X POST http://localhost:3000/api/revalidate \
  -H "Authorization: Bearer your-long-random-secret" \
  -H "Content-Type: application/json" \
  -d '{"revalidateAll":true}'
```

```bash
curl -X POST http://localhost:3000/api/revalidate \
  -H "Authorization: Bearer your-long-random-secret" \
  -H "Content-Type: application/json" \
  -d '{"path":"/about","prewarm":true}'
```

Use `revalidateLayout: true` when shared header/footer content changed. Use `revalidateAll: true` when a CMS change should invalidate the whole site.
Use `prewarm: true` when you want the API call itself to immediately request the invalidated page and refill the cache instead of waiting for the next browser hit.

The revalidation route also invalidates the shared CMS data cache tag for the current `WEBSITE_ID`, so updated CMS content is fetched fresh on the next page visit after a successful request.

## Analytics

Umami is supported out of the box.

Set these env vars to enable it:

- `UMAMI_HOST_URL`
- `UMAMI_WEBSITE_ID`

The template loads Umami with `next/script` in the root layout and proxies requests through first-party paths to reduce ad blocker interference:

- Script: `/a/script.js`
- Collection endpoint: `/a/api/send`

The proxy forwards traffic to your configured Umami instance while keeping the browser-facing URLs on your own domain.

## Reusing this starter for a new client

1. Update `.env` with the new CMS base URL and website ID.
2. Adjust `src/types/cms.ts` if the API response shape has changed.
3. Add new endpoint helpers in `src/lib/cms.ts`.
4. Replace the placeholder section rendering with project-specific components when needed.
