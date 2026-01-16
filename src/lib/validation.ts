export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export function getRequiredString(formData: FormData, key: string): string {
  const raw = formData.get(key);
  if (typeof raw !== "string") {
    throw new ValidationError(`Missing required field: ${key}`);
  }
  const value = raw.trim();
  if (!value) {
    throw new ValidationError(`Missing required field: ${key}`);
  }
  return value;
}

export function getOptionalString(formData: FormData, key: string): string | null {
  const raw = formData.get(key);
  if (raw === null || raw === undefined) return null;
  if (typeof raw !== "string") return null;
  const value = raw.trim();
  return value ? value : null;
}

export function getRequiredInt(formData: FormData, key: string): number {
  const raw = getRequiredString(formData, key);
  const num = parseInt(raw, 10);
  if (Number.isNaN(num)) {
    throw new ValidationError(`Invalid number for field: ${key}`);
  }
  return num;
}

export function getCheckbox(formData: FormData, key: string): boolean {
  // HTML checkbox posts "on" when checked; absent otherwise.
  return formData.get(key) === "on";
}

