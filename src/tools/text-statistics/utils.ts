export interface TextStats {
  chars: number;
  charsNoSpaces: number;
  words: number;
  lines: number;
  paragraphs: number;
  readingTimeMinutes: number; // approximate
}

export type Result = { success: true; data: TextStats } | { success: false; error: string };

export function analyzeText(input: string): Result {
  try {
    const text = input ?? '';
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s+/g, '').length;
    const lines = text === '' ? 0 : text.split(/\r?\n/).length;
    const paragraphs = text.trim() === '' ? 0 : text.split(/\n\s*\n/).filter(Boolean).length;
    const words = text.trim() === '' ? 0 : (text.trim().split(/\s+/).filter(Boolean).length);
    // average reading speed 200 words per minute
    const readingTimeMinutes = Math.max(0, +(words / 200).toFixed(2));

    return {
      success: true,
      data: {
        chars,
        charsNoSpaces,
        words,
        lines,
        paragraphs,
        readingTimeMinutes,
      },
    };
  } catch (e) {
    return { success: false, error: (e as Error).message || 'Unknown error' };
  }
}
