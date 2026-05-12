export type HashAlgorithm = 'MD5' | 'SHA-1' | 'SHA-256' | 'SHA-512';

export async function hashString(algorithm: HashAlgorithm, input: string): Promise<string> {
  if (algorithm === 'MD5' || algorithm === 'SHA-1') {
    throw new Error(`${algorithm} is deprecated and not supported in browsers. Use SHA-256 or SHA-512 instead.`);
  }
  
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function hashFile(algorithm: HashAlgorithm, file: File): Promise<string> {
  return hashString(algorithm, await file.text());
}

export const hashAlgorithms: { id: HashAlgorithm; name: string; secure: boolean }[] = [
  { id: 'MD5', name: 'MD5', secure: false },
  { id: 'SHA-1', name: 'SHA-1', secure: false },
  { id: 'SHA-256', name: 'SHA-256', secure: true },
  { id: 'SHA-512', name: 'SHA-512', secure: true },
];