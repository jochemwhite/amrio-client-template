import type {
  BuilderField,
  FormSubmissionValues,
} from "@/types/form-builder";

/**
 * Public input shape for the `submitCmsFormAction` server action.
 *
 * Lives in its own module so client components can import the type without
 * pulling in the "use server" file — importing types from a "use server"
 * module breaks Turbopack HMR and triggers "Router action dispatched before
 * initialization" on reload.
 */
export type SubmitCmsFormInput = {
  formId: string;
  formContent: BuilderField[];
  rawValues: FormSubmissionValues;
  metadata?: Record<string, unknown>;
};
