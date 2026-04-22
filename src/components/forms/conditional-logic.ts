import type {
  BuilderField,
  ConditionalLogic,
  ConditionalRule,
  SubmissionBuilderField,
} from "@/types/form-builder";
import { flattenSubmissionFields } from "@/types/form-builder";

function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim() === "";
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.keys(value as object).length === 0;
  return false;
}

function coerceNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function valuesEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a == null || b == null) return a == b;
  return String(a) === String(b);
}

function evaluateRule(rule: ConditionalRule, values: Record<string, unknown>): boolean {
  const current = values[rule.field];

  switch (rule.operator) {
    case "equals":
      if (Array.isArray(current)) {
        return current.some((item) => valuesEqual(item, rule.value));
      }
      return valuesEqual(current, rule.value);
    case "notEquals":
      if (Array.isArray(current)) {
        return !current.some((item) => valuesEqual(item, rule.value));
      }
      return !valuesEqual(current, rule.value);
    case "contains":
      if (Array.isArray(current)) {
        return current.some((item) => valuesEqual(item, rule.value));
      }
      if (typeof current === "string" && typeof rule.value === "string") {
        return current.includes(rule.value);
      }
      return false;
    case "notContains":
      if (Array.isArray(current)) {
        return !current.some((item) => valuesEqual(item, rule.value));
      }
      if (typeof current === "string" && typeof rule.value === "string") {
        return !current.includes(rule.value);
      }
      return true;
    case "isEmpty":
      return isEmpty(current);
    case "isNotEmpty":
      return !isEmpty(current);
    case "greaterThan": {
      const left = coerceNumber(current);
      const right = coerceNumber(rule.value);
      return left !== null && right !== null && left > right;
    }
    case "lessThan": {
      const left = coerceNumber(current);
      const right = coerceNumber(rule.value);
      return left !== null && right !== null && left < right;
    }
    default:
      return true;
  }
}

export function evaluateConditionalLogic(
  logic: ConditionalLogic | undefined,
  values: Record<string, unknown>,
): boolean {
  if (!logic || !Array.isArray(logic.rules) || logic.rules.length === 0) {
    return true;
  }

  const match = logic.match ?? "all";
  const action = logic.action ?? "show";

  const outcome =
    match === "any"
      ? logic.rules.some((rule) => evaluateRule(rule, values))
      : logic.rules.every((rule) => evaluateRule(rule, values));

  return action === "hide" ? !outcome : outcome;
}

export function isFieldVisible(
  field: BuilderField,
  values: Record<string, unknown>,
): boolean {
  if (field.hidden) return false;
  return evaluateConditionalLogic(field.conditionalLogic, values);
}

export function computeVisibleSubmissionKeys(
  content: BuilderField[],
  values: Record<string, unknown>,
): Set<string> {
  const visible = new Set<string>();

  const walk = (fields: BuilderField[], parentVisible: boolean) => {
    for (const field of fields) {
      const selfVisible = parentVisible && isFieldVisible(field, values);

      if (field.type === "section") {
        walk(field.children ?? [], selfVisible);
        continue;
      }

      if (selfVisible && "key" in field && field.key) {
        visible.add(field.key);
      }
    }
  };

  walk(content, true);
  return visible;
}

export function getSubmissionFields(
  content: BuilderField[],
): SubmissionBuilderField[] {
  return flattenSubmissionFields(content);
}
