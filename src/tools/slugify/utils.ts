export function slugify(input: string): string {
  if (!input) return '';
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export type Result = { success: true; data: string } | { success: false; error: string };

export function slugifyResult(input: string): Result {
  try {
    return { success: true, data: slugify(input) };
  } catch (e) {
    return { success: false, error: (e as Error).message || 'Unknown error' };
  }
}
