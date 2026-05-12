export function sanitizeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function wrapHtmlDocument(content: string): string {
  const trimmed = content.trim();
  if (/^<!DOCTYPE/i.test(trimmed) || /^<html/i.test(trimmed)) return trimmed;
  if (/^<(head|body|div|p|h[1-6]|section|main|article|header|footer|nav|aside|table|form|ul|ol|script|style)/i.test(trimmed)) {
    return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head><body>${trimmed}</body></html>`;
  }
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head><body>${trimmed}</body></html>`;
}
