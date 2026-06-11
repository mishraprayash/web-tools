export interface Ipv6Details {
  original: string;
  expanded: string;
  compressed: string;
  reverseDns: string;
  isLinkLocal: boolean;
  isMulticast: boolean;
  isLoopback: boolean;
  isUnspecified: boolean;
}

export type Result<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * Validates, expands, and compresses IPv6 addresses.
 */
export function processIpv6(ipStr: string): Result<Ipv6Details> {
  try {
    const cleaned = ipStr.trim();
    
    // Quick regex validation for generic IPv6
    // Must contain up to 7 colons and hex characters
    const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
    
    if (!ipv6Regex.test(cleaned)) {
      return { success: false, error: 'Invalid IPv6 address format.' };
    }

    // 1. Expand the IPv6 Address (ensure 8 blocks of 4 hex chars)
    let blocks: string[] = [];
    if (cleaned.includes('::')) {
      const parts = cleaned.split('::');
      const leftPart = parts[0] ? parts[0].split(':') : [];
      const rightPart = parts[1] ? parts[1].split(':') : [];
      const missingCount = 8 - (leftPart.length + rightPart.length);
      const middlePart = Array(missingCount).fill('0000');
      blocks = [...leftPart, ...middlePart, ...rightPart];
    } else {
      blocks = cleaned.split(':');
    }

    // Normalize each block to be exactly 4 hex characters
    const expandedBlocks = blocks.map(b => b.padStart(4, '0').toLowerCase());
    const expanded = expandedBlocks.join(':');

    // 2. Compress the IPv6 Address (RFC 5952 standard compression rules)
    // Find the longest run of consecutive 0 blocks (at least 2 blocks of zeros)
    let bestStart = -1;
    let bestLen = 0;
    let currentStart = -1;
    let currentLen = 0;

    for (let i = 0; i < 8; i++) {
      if (parseInt(expandedBlocks[i], 16) === 0) {
        if (currentLen === 0) {
          currentStart = i;
        }
        currentLen++;
        if (currentLen > bestLen) {
          bestLen = currentLen;
          bestStart = currentStart;
        }
      } else {
        currentLen = 0;
      }
    }

    const compressedBlocks = expandedBlocks.map(b => {
      const parsed = parseInt(b, 16);
      return parsed.toString(16); // Remove leading zeros
    });

    let compressed = '';
    if (bestLen > 1) {
      const leftSide = compressedBlocks.slice(0, bestStart).join(':');
      const rightSide = compressedBlocks.slice(bestStart + bestLen).join(':');
      compressed = `${leftSide}::${rightSide}`;
    } else {
      compressed = compressedBlocks.join(':');
    }

    // 3. Generate Reverse DNS Address lookup string
    const reverseDns = expandedBlocks.join('')
      .split('')
      .reverse()
      .join('.') + '.ip6.arpa';

    // 4. IP Classification properties
    const isLinkLocal = expanded.startsWith('fe80');
    const isMulticast = expanded.startsWith('ff');
    const isLoopback = expanded === '0000:0000:0000:0000:0000:0000:0000:0001';
    const isUnspecified = expanded === '0000:0000:0000:0000:0000:0000:0000:0000';

    return {
      success: true,
      data: {
        original: cleaned,
        expanded,
        compressed,
        reverseDns,
        isLinkLocal,
        isMulticast,
        isLoopback,
        isUnspecified
      }
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown IPv6 parsing error.'
    };
  }
}
export { };
