import type {
  NavigationMenuContentField,
  RenderableContentField,
  SectionContentField,
} from "@/types/content";

export const sampleStandaloneFields: RenderableContentField[] = [
  {
    id: "text-hero",
    type: "text",
    fieldKey: "headline",
    label: "Text",
    order: 1,
    content: {
      text: "Reusable content components for CMS-driven pages",
      variant: "heading",
    },
  },
  {
    id: "richtext-intro",
    type: "richtext",
    fieldKey: "intro",
    label: "Rich Text",
    order: 2,
    content: {
      plainText:
        "This starter separates field logic from visual polish so teams can clone it and restyle it quickly.",
      blocks: [
        {
          type: "paragraph",
          spans: [
            { text: "This starter separates " },
            { text: "field logic", marks: { bold: true } },
            { text: " from presentation so cloned projects stay easy to theme." },
          ],
        },
        {
          type: "list",
          items: [
            [{ text: "Typed content models" }],
            [{ text: "Composable field registry" }],
            [{ text: "Demo content for every supported field type" }],
          ],
        },
      ],
    },
  },
  {
    id: "boolean-featured",
    type: "boolean",
    fieldKey: "featured",
    label: "Boolean",
    order: 3,
    content: {
      value: true,
      trueLabel: "Featured",
      falseLabel: "Standard",
      presentation: "badge",
    },
  },
  {
    id: "button-primary",
    type: "button",
    fieldKey: "cta",
    label: "Button",
    order: 4,
    content: {
      label: "Read the integration guide",
      href: "/demo/content-components",
      variant: "primary",
    },
  },
  {
    id: "date-launch",
    type: "date",
    fieldKey: "published_at",
    label: "Date",
    order: 5,
    content: {
      value: "2026-04-03T09:30:00.000Z",
      format: { dateStyle: "full", timeStyle: "short" },
    },
  },
  {
    id: "image-cover",
    type: "image",
    fieldKey: "cover",
    label: "Image",
    order: 6,
    content: {
      src: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
      alt: "Desk with notebooks and laptop",
      caption: "Default media styles are intentionally neutral.",
      aspectRatio: "16 / 9",
    },
  },
  {
    id: "reference-related",
    type: "reference",
    fieldKey: "reference",
    label: "Reference",
    order: 7,
    content: {
      title: "Content Modeling Checklist",
      description:
        "A linked reference preview can represent related entries, products, authors, or collections.",
      href: "#",
      meta: "Internal reference",
    },
  },
  {
    id: "video-demo",
    type: "video",
    fieldKey: "video",
    label: "Video",
    order: 8,
    content: {
      title: "Overview video",
      embedUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
      caption: "Swap the embed strategy if your CMS exposes different video data.",
      aspectRatio: "16 / 9",
    },
  },
  {
    id: "social-footer",
    type: "social_media",
    fieldKey: "social",
    label: "Social Media",
    order: 9,
    content: {
      title: "Follow along",
      links: [
        { id: "social-1", label: "LinkedIn", href: "#" },
        { id: "social-2", label: "GitHub", href: "#" },
        { id: "social-3", label: "YouTube", href: "#" },
      ],
    },
  },
];

export const sampleNavigationField: NavigationMenuContentField = {
  id: "nav-main",
  type: "navigation_menu",
  fieldKey: "main_navigation",
  label: "Navigation Menu",
  order: 10,
  content: {
    title: "Primary navigation",
    items: [
      { id: "nav-home", label: "Home", href: "/" },
      {
        id: "nav-solutions",
        label: "Solutions",
        href: "#",
        children: [
          { id: "nav-solutions-1", label: "Pages", href: "#" },
          { id: "nav-solutions-2", label: "Collections", href: "#" },
        ],
      },
      { id: "nav-contact", label: "Contact", href: "#" },
    ],
  },
};

export const sampleNestedSection: SectionContentField = {
  id: "section-highlight",
  type: "section",
  fieldKey: "highlight_section",
  label: "Section",
  order: 11,
  content: {
    title: "Nested section",
    description:
      "Sections render child fields recursively, so they work for cards, grids, stacks, and repeatable containers.",
    layout: "grid",
    children: [
      {
        id: "nested-text",
        type: "text",
        fieldKey: "title",
        order: 1,
        content: {
          text: "Inside a reusable section renderer",
          variant: "subheading",
        },
      },
      {
        id: "nested-boolean",
        type: "boolean",
        fieldKey: "available",
        order: 2,
        content: {
          value: false,
          falseLabel: "Needs content",
          presentation: "toggle",
        },
      },
      {
        id: "nested-unknown",
        type: "custom_embed",
        fieldKey: "custom_embed",
        order: 3,
        content: {
          provider: "custom",
          snippet: "<iframe />",
        },
      },
    ],
  },
};

export const sampleDemoFields: RenderableContentField[] = [
  ...sampleStandaloneFields,
  sampleNavigationField,
  sampleNestedSection,
];

export const sampleEmptyStates: RenderableContentField[] = [
  {
    id: "empty-image",
    type: "image",
    fieldKey: "empty_image",
    label: "Image empty state",
    order: 1,
    content: {},
  },
  {
    id: "empty-video",
    type: "video",
    fieldKey: "empty_video",
    label: "Video empty state",
    order: 2,
    content: {},
  },
  {
    id: "empty-social",
    type: "social_media",
    fieldKey: "empty_social",
    label: "Social empty state",
    order: 3,
    content: {
      links: [],
    },
  },
];

