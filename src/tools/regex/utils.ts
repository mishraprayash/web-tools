export interface RegexMatch {
  index: number;
  text: string;
  groups: string[];
}

export interface RegexResult {
  matches: RegexMatch[];
  isValid: boolean;
  error?: string;
  pattern: string;
}

export function testRegex(pattern: string, flags: string, input: string): RegexResult {
  if (!pattern) {
    return { matches: [], isValid: true, pattern };
  }

  try {
    const regex = new RegExp(pattern, flags);
    const matches: RegexMatch[] = [];
    let match;

    if (flags.includes('g')) {
      while ((match = regex.exec(input)) !== null) {
        matches.push({
          index: match.index,
          text: match[0],
          groups: match.slice(1),
        });
        if (!flags.includes('g')) break;
      }
    } else {
      match = regex.exec(input);
      if (match) {
        matches.push({
          index: match.index,
          text: match[0],
          groups: match.slice(1),
        });
      }
    }

    return { matches, isValid: true, pattern };
  } catch (e) {
    return {
      matches: [],
      isValid: false,
      error: (e as Error).message,
      pattern,
    };
  }
}

export function highlightMatches(input: string, matches: RegexMatch[]): { start: number; end: number }[] {
  return matches.map((m) => ({
    start: m.index,
    end: m.index + m.text.length,
  }));
}

export const regexFlags = [
  { id: 'g', name: 'Global', description: 'Find all matches' },
  { id: 'i', name: 'Case Insensitive', description: 'Ignore case' },
  { id: 'm', name: 'Multiline', description: '^ and $ match line breaks' },
  { id: 's', name: 'Dot All', description: '. matches newlines' },
];