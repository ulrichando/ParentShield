export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

export function sanitizeString(str: string | undefined | null): string | undefined {
  if (!str) return undefined;
  return str.trim().slice(0, 255);
}
