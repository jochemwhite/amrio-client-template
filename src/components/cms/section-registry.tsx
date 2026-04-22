import type { ReactNode } from "react";

import { DefaultSection } from "@/components/cms/sections/default-section";
import { HeroSection } from "@/components/cms/sections/hero-section";
import type { CmsSectionComponent } from "@/components/cms/sections/shared";
import type { CmsContentSection } from "@/types/cms";
import { ContactSection } from "./sections/contact-section";

const sectionRegistry: Record<string, CmsSectionComponent> = {
  hero: HeroSection,
  default: DefaultSection,
  contact: ContactSection,
};

export function getCmsSectionComponent(type: string) {
  return sectionRegistry[type] ?? DefaultSection;
}

export function renderCmsSection(section: CmsContentSection): ReactNode {
  const SectionComponent = getCmsSectionComponent(section.type);

  return <SectionComponent section={section} />;
}
