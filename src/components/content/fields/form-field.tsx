import { CmsFormRenderer } from "@/components/content/fields/cms-form-renderer";
import type { FormContentField } from "@/types/content";
import type { CmsForm } from "@/types/form-builder";

export function FormField({ field }: { field: FormContentField }) {
  const content = field.content;

  if (
    !content ||
    !Array.isArray(content.content) ||
    content.content.length === 0
  ) {
    return (
      <p className="text-sm text-muted">
        This form has no fields configured yet.
      </p>
    );
  }

  const form: CmsForm = {
    id: content.id,
    name: content.name,
    description: content.description,
    published: content.published,
    share_url: content.share_url,
    content: content.content,
  };

  return (
    <CmsFormRenderer
      form={form}
      submitLabel={content.submitLabel}
      successMessage={content.successMessage}
    />
  );
}
