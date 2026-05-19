export type UrlMode = 'component' | 'uri' | 'strict';

export interface QueryParam {
  id: string;
  key: string;
  value: string;
}

export interface UrlBreakdown {
  baseUrl: string;
  params: QueryParam[];
  hash: string;
}

export function strictEncode(str: string): string {
  return encodeURIComponent(str).replace(/[!'()*]/g, (c) => {
    return `%${c.charCodeAt(0).toString(16).toUpperCase()}`;
  });
}

export function encodeUrlStr(input: string, mode: UrlMode = 'component'): string {
  try {
    if (mode === 'uri') {
      return encodeURI(input);
    }
    if (mode === 'strict') {
      return strictEncode(input);
    }
    return encodeURIComponent(input);
  } catch {
    return input;
  }
}

export function decodeUrlStr(input: string, mode: UrlMode = 'component'): string {
  try {
    if (mode === 'uri') {
      return decodeURI(input);
    }
    return decodeURIComponent(input);
  } catch {
    return input;
  }
}

export function parseUrl(input: string): UrlBreakdown {
  let url = input.trim();
  let hash = '';
  
  // Extract hash first
  const hashIdx = url.indexOf('#');
  if (hashIdx !== -1) {
    hash = url.slice(hashIdx);
    url = url.slice(0, hashIdx);
  }

  let baseUrl = url;
  let search = '';

  const qIdx = url.indexOf('?');
  if (qIdx !== -1) {
    baseUrl = url.slice(0, qIdx);
    search = url.slice(qIdx + 1);
  }

  const params: QueryParam[] = [];
  if (search) {
    search.split('&').forEach((pair, index) => {
      if (!pair) return;
      const parts = pair.split('=');
      const key = parts[0] || '';
      const value = parts.slice(1).join('=') || '';
      try {
        params.push({
          id: `${index}-${Math.random().toString(36).slice(2, 6)}`,
          key: decodeURIComponent(key),
          value: decodeURIComponent(value)
        });
      } catch {
        params.push({
          id: `${index}-${Math.random().toString(36).slice(2, 6)}`,
          key,
          value
        });
      }
    });
  }

  return {
    baseUrl,
    params,
    hash
  };
}

export function rebuildUrl(baseUrl: string, params: QueryParam[], hash?: string): string {
  const queryStr = params
    .filter((p) => p.key.trim() !== '')
    .map((p) => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`)
    .join('&');

  let result = baseUrl;
  if (queryStr) {
    result += '?' + queryStr;
  }
  if (hash) {
    result += hash.startsWith('#') ? hash : '#' + hash;
  }
  return result;
}
