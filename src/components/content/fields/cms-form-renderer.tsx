"use client";

import * as React from "react";

import { submitCmsFormAction } from "@/actions/submitCmsFormAction";
import { FormRenderer } from "@/components/forms/FormRenderer";
import type { CmsForm, FormSubmissionValues } from "@/types/form-builder";

type CmsFormRendererProps = {
  form: CmsForm;
  submitLabel?: string;
  successMessage?: string;
  resetOnSuccess?: boolean;
  className?: string;
};

export function CmsFormRenderer({
  form,
  submitLabel,
  successMessage,
  resetOnSuccess = false,
  className,
}: CmsFormRendererProps) {
  const handleSubmit = React.useCallback(
    async (values: FormSubmissionValues) => {
      return submitCmsFormAction({
        formId: form.id,
        formContent: form.content,
        rawValues: values,
      });
    },
    [form.id, form.content],
  );

  return (
    <FormRenderer
      form={form}
      onSubmit={handleSubmit}
      submitLabel={submitLabel}
      successMessage={successMessage}
      resetOnSuccess={resetOnSuccess}
      className={className}
    />
  );
}
