export function sanitizeString(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

export function sanitizePan(value: string): string {
  return sanitizeString(value).toUpperCase();
}
