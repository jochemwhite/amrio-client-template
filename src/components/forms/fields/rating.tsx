import { Controller } from "react-hook-form";
import { Star } from "lucide-react";

import { cn } from "@/lib/utils";
import type { RatingBuilderField } from "@/types/form-builder";

import type { SubmissionFieldRenderer } from "./types";

export const renderRatingField: SubmissionFieldRenderer<
  RatingBuilderField & { key: string }
> = ({ block, rhf, fieldId }) => (
  <Controller
    control={rhf.control}
    name={block.key}
    render={({ field }) => {
      const max = block.max ?? 5;
      const value =
        typeof field.value === "number"
          ? field.value
          : Number(field.value) || 0;

      return (
        <div
          id={fieldId}
          role="radiogroup"
          aria-label={block.label ?? "Rating"}
          className="flex items-center gap-1"
        >
          {Array.from({ length: max }, (_, index) => {
            const score = index + 1;
            const active = score <= value;
            return (
              <button
                key={score}
                type="button"
                disabled={block.readOnly}
                aria-label={`${score} of ${max}`}
                aria-pressed={active}
                onClick={() => field.onChange(score)}
                className={cn(
                  "rounded p-1 transition-colors",
                  active ? "text-form-accent" : "text-form-description",
                  "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-form-control-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                )}
              >
                <Star
                  className="size-5"
                  fill={active ? "currentColor" : "none"}
                />
              </button>
            );
          })}
        </div>
      );
    }}
  />
);
