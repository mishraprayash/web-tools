type Result = { success: true; data: string } | { success: false; error: string };

export function encodeEntities(input: string): Result {
  try {
    const out = input.replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
    return { success: true, data: out };
  } catch (e) {
    return { success: false, error: (e as Error).message || 'Unknown error' };
  }
}

export function decodeEntities(input: string): Result {
  try {
    const txt = input.replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
    return { success: true, data: txt };
  } catch (e) {
    return { success: false, error: (e as Error).message || 'Unknown error' };
  }
}
