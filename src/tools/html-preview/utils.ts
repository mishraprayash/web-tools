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

export function formatHtml(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return input;

  const selfClosing = /^(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)$/i;

  const normalized = trimmed
    .replace(/\r\n?/g, '\n')
    .replace(/>\s*</g, '>\n<')
    .replace(/([^>])\s*<\//g, '$1\n<\/')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  const result: string[] = [];
  let indent = 0;

  for (const line of normalized) {
    const isClosing = /^<\//.test(line);
    const tagName = line.match(/^<\/?(\w+)/)?.[1];
    const isSelfClosing = tagName ? selfClosing.test(tagName) || /\/>$/.test(line) : false;

    if (isClosing) indent = Math.max(0, indent - 1);
    result.push('  '.repeat(indent) + line);
    if (!isClosing && !isSelfClosing && /^<[^/]/.test(line)) indent++;
  }

  return result.join('\n');
}
