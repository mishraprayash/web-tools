export function sanitizeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function wrapHtmlDocument(
  content: string,
  options: { tailwind: boolean; bootstrap: boolean; fontawesome: boolean } = { tailwind: false, bootstrap: false, fontawesome: false }
): string {
  let headInjections = '<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">';
  if (options.tailwind) {
    headInjections += '\n  <script src="https://cdn.tailwindcss.com"></script>';
  }
  if (options.bootstrap) {
    headInjections += '\n  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">';
  }
  if (options.fontawesome) {
    headInjections += '\n  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">';
  }
  
  const trimmed = content.trim();
  if (/^<!DOCTYPE/i.test(trimmed) || /^<html/i.test(trimmed)) {
    let result = trimmed;
    if (options.tailwind || options.bootstrap || options.fontawesome) {
      if (/<head>/i.test(result)) {
        result = result.replace(/<head>/i, `<head>\n  ${headInjections}`);
      } else if (/<html[^>]*>/i.test(result)) {
        result = result.replace(/<html([^>]*)>/i, `<html$1>\n<head>\n  ${headInjections}\n</head>`);
      }
    }
    return result;
  }

  // Set nice default styling class if using Tailwind, otherwise standard padding
  const bodyClass = options.tailwind 
    ? 'bg-slate-50 text-slate-900 p-6 font-sans antialiased' 
    : options.bootstrap
    ? 'bg-light text-dark p-4'
    : 'font-family:sans-serif; padding: 20px; line-height: 1.6; background: #fafafa;';

  return `<!DOCTYPE html>
<html>
<head>
  ${headInjections}
</head>
<body ${options.tailwind || options.bootstrap ? `class="${bodyClass}"` : `style="${bodyClass}"`}>
  ${trimmed}
</body>
</html>`;
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
    const tagName = line.match(/^<\/?([a-zA-Z0-9:-]+)/)?.[1];
    const isSelfClosing = tagName ? selfClosing.test(tagName) || /\/>$/.test(line) : false;

    if (isClosing) indent = Math.max(0, indent - 1);
    result.push('  '.repeat(indent) + line);
    if (!isClosing && !isSelfClosing && /^<[a-zA-Z0-9:-]+/.test(line)) indent++;
  }

  return result.join('\n');
}
