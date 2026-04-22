"use server";

import type { FormSubmissionResult } from "@/types/form-builder";
import { computeVisibleSubmissionKeys } from "@/components/forms/conditional-logic";
import { createZodSchemaFromFormContent } from "@/components/forms/zodFromBuilder";
import type { SubmitCmsFormInput } from "./submit-cms-form.types";

// NOTE: this file uses "use server" so every top-level export MUST be an
// async function. Do not export types, constants, or sync helpers from here
// — Turbopack's HMR will break for the entire tree that transitively imports
// this module, and the App Router will throw
// "Router action dispatched before initialization" on reload.
// Put shared types in `./submit-cms-form.types.ts` instead.

/**
 * Validate a CMS form submission server-side (re-running the same builder
 * schema that the client uses) and persist it.
 *
 * We rebuild the Zod schema here rather than trust the client, so manipulated
 * payloads still get rejected.
 */
export async function submitCmsFormAction(
  input: SubmitCmsFormInput,
): Promise<FormSubmissionResult> {
  const { formId, formContent, rawValues, metadata } = input;

  if (!formId || typeof formId !== "string") {
    return { success: false, formError: "Missing form id." };
  }

  if (!Array.isArray(formContent)) {
    return { success: false, formError: "Form definition is invalid." };
  }

  const visibleKeys = computeVisibleSubmissionKeys(formContent, rawValues);
  const schema = createZodSchemaFromFormContent(formContent, { visibleKeys });
  const parsed = schema.safeParse(rawValues);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};

    for (const issue of parsed.error.issues) {
      const key = issue.path
        .filter((segment) => typeof segment === "string" || typeof segment === "number")
        .join(".");

      if (key && !fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }

    return {
      success: false,
      formError: "Please fix the errors below and try again.",
      fieldErrors,
    };
  }

  try {
    await persistCmsFormSubmission({
      formId,
      values: parsed.data,
      metadata,
    });
  } catch (error) {
    console.error("Failed to persist CMS form submission.", error);
    return {
      success: false,
      formError:
        "We could not submit the form right now. Please try again in a moment.",
    };
  }

  return { success: true };
}

type PersistSubmissionInput = {
  formId: string;
  values: Record<string, unknown>;
  metadata?: Record<string, unknown>;
};

/**
 * Persistence seam. Replace the body with whatever transport the client
 * project uses (Supabase insert, CMS REST endpoint, etc.).
 *
 * Kept as an async function so the server action does not need to care
 * about the underlying strategy.
 */
async function persistCmsFormSubmission(
  input: PersistSubmissionInput,
): Promise<void> {
  // TODO: wire this up to the CMS / database.
  // Example shape the persistence layer receives:
  //   {
  //     form_id: input.formId,
  //     content: input.values,
  //     metadata: input.metadata ?? {},
  //     submitted_at: new Date().toISOString(),
  //   }
  //
  // Intentionally left unimplemented in the template.
  if (process.env.NODE_ENV !== "production") {
    console.info("[submitCmsFormAction] submission received", {
      form_id: input.formId,
      content: input.values,
      metadata: input.metadata ?? {},
    });
  }
}
