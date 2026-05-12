export type Base64Action = 'encode' | 'decode';

export function encodeBase64(input: string, urlSafe: boolean = false): string {
  try {
    const encoded = btoa(unescape(encodeURIComponent(input)));
    if (urlSafe) {
      return encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }
    return encoded;
  } catch {
    return input;
  }
}

export function decodeBase64(input: string, urlSafe: boolean = false): string {
  try {
    let normalized = input;
    if (urlSafe) {
      normalized = input.replace(/-/g, '+').replace(/_/g, '/');
      const pad = normalized.length % 4;
      if (pad) {
        normalized += '='.repeat(4 - pad);
      }
    }
    return decodeURIComponent(escape(atob(normalized)));
  } catch {
    return input;
  }
}

export function isValidBase64(input: string): boolean {
  const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
  const urlSafeRegex = /^[A-Za-z0-9_-]*$/;
  return base64Regex.test(input) || urlSafeRegex.test(input);
}

export function processBase64(input: string, action: Base64Action, urlSafe: boolean = false): string {
  switch (action) {
    case 'encode':
      return encodeBase64(input, urlSafe);
    case 'decode':
      return decodeBase64(input, urlSafe);
    default:
      return input;
  }
}