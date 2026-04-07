import { ContentImage } from "@/components/content/content-image";
import { ContentLink } from "@/components/content/content-link";
import { RichTextField } from "@/components/content/fields/richtext-field";
import { getFieldByKey, sortByOrder } from "@/components/content/utils";
import type { ButtonContentField } from "@/types/content";
import type { CmsLayoutEntry } from "@/types/cms";

import { getRenderableFields, normalizeHref } from "./layout-shared";
import Link from "next/link";

function FooterAction({ field }: { field?: ButtonContentField }) {
  const label = field?.content.label?.trim();
  const href = normalizeHref(field?.content.href);

  if (!label || !href) {
    return null;
  }

  return (
    <ContentLink
      className="inline-flex min-h-11 items-center justify-center rounded-full border border-footer-foreground/20 px-4 py-3 text-sm font-semibold text-footer-foreground transition-colors hover:bg-footer-foreground hover:text-footer"
      href={href}
      target={field?.content.target}
    >
      {label}
    </ContentLink>
  );
}

export function CmsFooter({ entry }: { entry: CmsLayoutEntry }) {
  const sections = sortByOrder(entry.sections);
  const top = sections.find(
    (section) => section.name.trim().toLowerCase() === "top",
  );
  const middle = sections.find(
    (section) => section.name.trim().toLowerCase() === "middle",
  );
  const topFields = top ? getRenderableFields(top) : [];
  const middleFields = middle ? getRenderableFields(middle) : [];
  const footerLogo = getFieldByKey(topFields, "footer_logo", "image");
  const footerTitle = getFieldByKey(middleFields, "title", "text");
  const footerAbout = getFieldByKey(middleFields, "about", "richtext");
  const footerButton = getFieldByKey(middleFields, "button", "button");

  const currentyear = new Date().getFullYear();

  return (
    <footer
      className="mt-16 border-t border-footer-border bg-footer text-footer-foreground"
      data-layout-entry={entry.name}
    >
      <div className="container mx-auto grid gap-10 px-4 py-12 md:grid-cols-[auto_minmax(0,1fr)] md:items-start">
        <div className="flex items-start">
          {footerLogo?.content.src ? (
            <ContentImage
              alt={footerLogo.content.alt ?? entry.name}
              className="h-20 w-20 rounded-2xl object-contain"
              height={80}
              src={footerLogo.content.src}
              width={80}
            />
          ) : null}
        </div>

        <div className="grid gap-5">
          {footerTitle?.content.text ? (
            <h2 className="text-2xl font-semibold tracking-tight">
              {footerTitle.content.text}
            </h2>
          ) : null}

          {footerAbout ? (
            <div className="max-w-3xl text-footer-foreground [&_a]:text-footer-foreground [&_a:hover]:text-primary-soft [&_blockquote]:border-footer-muted/40 [&_blockquote]:text-footer-muted [&_code]:bg-footer-foreground/10 [&_p]:text-inherit">
              <RichTextField field={footerAbout} />
            </div>
          ) : null}

          <FooterAction field={footerButton} />
        </div>
      </div>

      <div className="border-t border-footer-border">
        <div className="container mx-auto flex flex-col gap-2 px-4 py-5 text-sm text-footer-muted md:flex-row md:items-center md:justify-between">
          <p>© {currentyear} Amrio. All rights reserved.</p>
          <Link
            className="transition-colors hover:text-footer-foreground"
            href="https://amrio.nl"
            target="_blank"
          >
            Gemaakt door Amrio
          </Link>
        </div>
      </div>
    </footer>
  );
}
