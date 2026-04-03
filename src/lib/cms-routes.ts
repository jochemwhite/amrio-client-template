export function getSlugPath(segments?: string[]) {
  const slug = segments?.filter(Boolean).join("/") ?? "";

  return slug || "/";
}
