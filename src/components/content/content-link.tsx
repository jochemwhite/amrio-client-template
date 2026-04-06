import Link from "next/link";
import type { ReactNode } from "react";

function isInternalHref(href: string) {
  return href.startsWith("/") || href.startsWith("#");
}

type ContentLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  target?: "_self" | "_blank";
};

export function ContentLink({
  href,
  children,
  className,
  target,
}: ContentLinkProps) {
  if (isInternalHref(href)) {
    return (
      <Link className={className} href={href}>
        {children}
      </Link>
    );
  }

  return (
    <Link
      className={className}
      href={href}
      rel={target === "_blank" ? "noreferrer" : undefined}
      target={target}
    >
      {children}
    </Link>
  );
}
