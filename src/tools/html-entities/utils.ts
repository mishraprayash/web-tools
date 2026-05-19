export type EntityMode = 'named' | 'decimal' | 'hex';
export type EntityScope = 'markup' | 'all';

export interface EntityOptions {
  mode: EntityMode;
  scope: EntityScope;
}

export type EntityResult = 
  | { success: true; data: string } 
  | { success: false; error: string };

const namedEntities: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  copy: '©',
  reg: '®',
  trade: '™',
  deg: '°',
  plusmn: '±',
  times: '×',
  divide: '÷',
  frac12: '½',
  frac14: '¼',
  frac34: '¾',
  cent: '¢',
  pound: '£',
  yen: '¥',
  euro: '€',
  sect: '§',
  para: '¶',
  middot: '·',
  bull: '•',
  hellip: '…',
  ldquo: '“',
  rdquo: '”',
  lsquo: '‘',
  rsquo: '’',
  mdash: '—',
  ndash: '–',
  micro: 'µ',
  fnof: 'ƒ',
  alpha: 'α',
  beta: 'β',
  gamma: 'γ',
  delta: 'δ',
  epsilon: 'ε',
  theta: 'θ',
  lambda: 'λ',
  pi: 'π',
  omega: 'ω',
  infin: '∞',
  int: '∫',
  radic: '√',
  asymp: '≈',
  ne: '≠',
  le: '≤',
  ge: '≥',
  uarr: '↑',
  darr: '↓',
  larr: '←',
  rarr: '→',
  spades: '♠',
  clubs: '♣',
  hearts: '♥',
  diams: '♦'
};

// Inverse map for named encoding
const inverseEntities: Record<string, string> = {};
for (const [key, val] of Object.entries(namedEntities)) {
  inverseEntities[val] = key;
}

export function encodeEntities(input: string, options: Partial<EntityOptions> = {}): EntityResult {
  const opts: EntityOptions = {
    mode: 'named',
    scope: 'markup',
    ...options
  };

  try {
    let result = '';
    
    for (let i = 0; i < input.length; i++) {
      const char = input[i];
      const code = char.codePointAt(0);
      if (code === undefined) continue;

      // Determine if this character needs encoding based on scope
      const isMarkup = ['&', '<', '>', '"', "'"].includes(char);
      const isNonAscii = code > 127;
      const shouldEncode = opts.scope === 'all' ? (isMarkup || isNonAscii) : isMarkup;

      if (shouldEncode) {
        if (opts.mode === 'named' && inverseEntities[char]) {
          result += `&${inverseEntities[char]};`;
        } else if (opts.mode === 'hex') {
          result += `&#x${code.toString(16).toUpperCase()};`;
        } else {
          // Default to decimal
          result += `&#${code};`;
        }
      } else {
        result += char;
      }
      
      // Handle high-surrogate characters (emojis, etc.) incrementing pointer
      if (code > 0xffff) i++;
    }

    return { success: true, data: result };
  } catch (e) {
    return { success: false, error: (e as Error).message || 'Failed to encode entities' };
  }
}

export function decodeEntities(input: string): EntityResult {
  try {
    let result = input;

    // 1. Decode hexadecimal entities: &#x([0-9a-fA-F]+);
    result = result.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => {
      const code = parseInt(hex, 16);
      return String.fromCodePoint(code);
    });

    // 2. Decode decimal entities: &#([0-9]+);
    result = result.replace(/&#([0-9]+);/g, (_, dec) => {
      const code = parseInt(dec, 10);
      return String.fromCodePoint(code);
    });

    // 3. Decode named entities: &([a-zA-Z0-9]+);
    result = result.replace(/&([a-zA-Z0-9]+);/g, (match, name) => {
      const char = namedEntities[name];
      return char !== undefined ? char : match;
    });

    return { success: true, data: result };
  } catch (e) {
    return { success: false, error: (e as Error).message || 'Failed to decode entities' };
  }
}
