export type NumberBase = 'decimal' | 'hex' | 'binary' | 'octal';

interface BaseResult { decimal: string; hex: string; binary: string; octal: string; error?: never }
interface BaseError { error: string; decimal?: never; hex?: never; binary?: never; octal?: never }

export type ConvertResult = BaseResult | BaseError;

const BASE_RADIX: Record<NumberBase, number> = {
  decimal: 10,
  hex: 16,
  binary: 2,
  octal: 8,
};

export function convertNumber(input: string, from: NumberBase): ConvertResult {
  const trimmed = input.trim();
  if (!trimmed) return { error: 'Enter a value' };

  const radix = BASE_RADIX[from];
  const normalized = from === 'hex' ? trimmed.replace(/^0x/i, '') : trimmed;
  const num = parseInt(normalized, radix);

  if (isNaN(num)) return { error: `Invalid ${from} value` };
  if (!Number.isSafeInteger(num)) return { error: 'Value exceeds safe integer range' };

  return {
    decimal: num.toString(10),
    hex: '0x' + num.toString(16).toUpperCase(),
    binary: '0b' + num.toString(2),
    octal: '0o' + num.toString(8),
  };
}

export function formatLabel(base: NumberBase): string {
  const labels: Record<NumberBase, string> = {
    decimal: 'Decimal (0–9)',
    hex: 'Hexadecimal (0–9, A–F)',
    binary: 'Binary (0, 1)',
    octal: 'Octal (0–7)',
  };
  return labels[base];
}
