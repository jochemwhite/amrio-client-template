import type {
  BooleanContentField,
  ButtonContentField,
  ContentFieldComponent,
  DateContentField,
  FormContentField,
  ImageContentField,
  NavigationMenuContentField,
  ReferenceContentField,
  RichTextContentField,
  SectionContentField,
  SocialMediaContentField,
  TextContentField,
  VideoContentField,
} from "@/types/content";
import { BooleanField } from "@/components/content/fields/boolean-field";
import { ButtonField } from "@/components/content/fields/button-field";
import { DateField } from "@/components/content/fields/date-field";
import { FormField } from "@/components/content/fields/form-field";
import { ImageField } from "@/components/content/fields/image-field";
import { NavigationMenuField } from "@/components/content/fields/navigation-menu-field";
import { ReferenceField } from "@/components/content/fields/reference-field";
import { RichTextField } from "@/components/content/fields/richtext-field";
import { SectionField } from "@/components/content/fields/section-field";
import { SocialMediaField } from "@/components/content/fields/social-media-field";
import { TextField } from "@/components/content/fields/text-field";
import { VideoField } from "@/components/content/fields/video-field";

export const contentFieldRegistry: Record<string, ContentFieldComponent> = {
  text: ({ field }) => <TextField field={field as TextContentField} />,
  richtext: ({ field }) => <RichTextField field={field as RichTextContentField} />,
  boolean: ({ field }) => <BooleanField field={field as BooleanContentField} />,
  button: ({ field, onAction }) => (
    <ButtonField field={field as ButtonContentField} onAction={onAction} />
  ),
  date: ({ field }) => <DateField field={field as DateContentField} />,
  image: ({ field }) => <ImageField field={field as ImageContentField} />,
  reference: ({ field }) => <ReferenceField field={field as ReferenceContentField} />,
  video: ({ field }) => <VideoField field={field as VideoContentField} />,
  section: ({ field, depth, renderField }) => (
    <SectionField
      field={field as SectionContentField}
      depth={depth}
      renderField={renderField}
    />
  ),
  social_media: ({ field }) => (
    <SocialMediaField field={field as SocialMediaContentField} />
  ),
  navigation_menu: ({ field }) => (
    <NavigationMenuField field={field as NavigationMenuContentField} />
  ),
  form: ({ field }) => <FormField field={field as FormContentField} />,
};

/**
 * Register additional CMS block types that should render as forms. Any type
 * whose payload looks like a form (i.e. the CMS adapter normalizes it to
 * `type: "form"`) is already routed here automatically, but explicit aliases
 * are useful when a project always sends the same custom type name.
 */




export function getContentFieldComponent(type: string) {
  return contentFieldRegistry[type];
}
