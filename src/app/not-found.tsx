import { RouteStatus } from "@/components/app/route-status";

export default function NotFound() {
  return (
    <RouteStatus
      eyebrow="Not Found"
      title="CMS content was not found"
      description="Check the slug, confirm the CMS record exists, and verify the current website ID is pointing at the right site."
    />
  );
}
