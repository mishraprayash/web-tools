export interface PasswordOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
}

const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

export function generatePassword(options: PasswordOptions): string {
  let chars = '';
  if (options.lowercase) chars += LOWERCASE;
  if (options.uppercase) chars += UPPERCASE;
  if (options.numbers) chars += NUMBERS;
  if (options.symbols) chars += SYMBOLS;

  if (!chars) return '';
  const safeLen = Math.max(1, Math.min(options.length, 128));

  const array = new Uint32Array(safeLen);
  crypto.getRandomValues(array);

  let password = '';
  for (let i = 0; i < safeLen; i++) {
    password += chars[array[i] % chars.length];
  }

  return password;
}

export function estimateStrength(length: number, charsetSize: number): { label: string; score: number; color: string } {
  const bits = Math.log2(charsetSize) * length;
  if (bits < 30) return { label: 'Weak', score: 0.2, color: 'text-error' };
  if (bits < 50) return { label: 'Fair', score: 0.4, color: 'text-warning' };
  if (bits < 70) return { label: 'Strong', score: 0.7, color: 'text-accent' };
  return { label: 'Very Strong', score: 1, color: 'text-success' };
}
