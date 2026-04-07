import { RouteLoadingSkeleton, RouteStatus } from "@/components/app/route-status";

export default function Loading() {
  return (
    <RouteStatus
      eyebrow="Loading"
      title="Loading CMS content"
      description="Fetching the latest page data and shared layout content."
    >
      <RouteLoadingSkeleton />
    </RouteStatus>
  );
}
