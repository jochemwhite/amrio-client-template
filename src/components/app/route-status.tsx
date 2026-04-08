import type { ReactNode } from "react";

type RouteStatusProps = {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
};

export function RouteStatus({
  eyebrow,
  title,
  description,
  children,
}: RouteStatusProps) {
  return (
    <div className="mx-auto w-[min(960px,calc(100%-1rem))] py-6 md:w-[min(960px,calc(100%-2rem))] md:py-12">
      <div className="grid gap-6 rounded-2xl border border-border bg-surface p-6 shadow-(--shadow-elevated)">
        <div className="grid gap-3">
          <p className="inline-block text-xs leading-none font-medium tracking-[0.08em] text-subtle uppercase">
            {eyebrow}
          </p>
          <h1 className="text-[clamp(2rem,4vw,3rem)] leading-[1.05] font-semibold tracking-tight">
            {title}
          </h1>
          <p className="max-w-2xl text-muted">{description}</p>
        </div>
        {children ? <div>{children}</div> : null}
      </div>
    </div>
  );
}

export function RouteStatusButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-4 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary-strong"
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function RouteLoadingSkeleton() {
  return (
    <div className="grid gap-4">
      <div className="h-4 w-32 animate-pulse rounded-full bg-surface-strong" />
      <div className="h-12 w-[min(36rem,100%)] animate-pulse rounded-2xl bg-surface-strong" />
      <div className="grid gap-3">
        <div className="h-4 w-full animate-pulse rounded-full bg-surface-muted" />
        <div className="h-4 w-[92%] animate-pulse rounded-full bg-surface-muted" />
        <div className="h-4 w-[68%] animate-pulse rounded-full bg-surface-muted" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="h-40 animate-pulse rounded-2xl border border-border bg-surface-muted" />
        <div className="h-40 animate-pulse rounded-2xl border border-border bg-surface-muted" />
      </div>
    </div>
  );
}

export function CmsOutageState({
  title = "CMS content is temporarily unavailable",
  description = "The page shell is still up, but the CMS did not return content just now. Try again in a moment or revalidate this route after the CMS finishes updating.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <RouteStatus
      eyebrow="CMS Unavailable"
      title={title}
      description={description}
    />
  );
}

export function CmsEmptyState({
  title = "This page has no sections yet",
  description = "The route resolved successfully, but the CMS page does not have any published sections to render yet.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <RouteStatus
      eyebrow="Empty State"
      title={title}
      description={description}
    />
  );
}
