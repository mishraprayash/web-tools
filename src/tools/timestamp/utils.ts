export function toTimestamp(date: Date | string | number): number {
  if (typeof date === 'number') return date;
  if (typeof date === 'string') {
    const parsed = new Date(date);
    return parsed.getTime();
  }
  return date.getTime();
}

export function fromTimestamp(timestamp: number, unit: 'seconds' | 'milliseconds' = 'seconds'): Date {
  if (timestamp < 1e11) {
    return new Date(timestamp * 1000);
  }
  return new Date(timestamp);
}

export type ParseResult = { success: true; dateMs: number; detectedUnit: 'seconds'|'milliseconds'|'unknown' } | { success: false; error: string };

export function parseInput(input: string): ParseResult {
  if (!input || input.trim() === '') return { success: false, error: 'Empty input' };
  const s = input.trim();
  // numeric -> timestamp
  if (/^-?\d+$/.test(s)) {
    const num = parseInt(s, 10);
    const unit = detectTimestampUnit(s);
    if (unit === 'milliseconds') return { success: true, dateMs: num, detectedUnit: 'milliseconds' };
    if (unit === 'seconds') return { success: true, dateMs: num * 1000, detectedUnit: 'seconds' };
    return { success: true, dateMs: num, detectedUnit: 'unknown' };
  }

  // try Date.parse for ISO / RFC / common strings
  const parsed = Date.parse(s);
  if (!isNaN(parsed)) return { success: true, dateMs: parsed, detectedUnit: 'unknown' };

  return { success: false, error: 'Unable to parse input as timestamp or date string' };
}

export function toEpochSeconds(dateMs: number): number {
  return Math.floor(dateMs / 1000);
}

export function toEpochMilliseconds(dateMs: number): number {
  return dateMs;
}

export function formatInTimezone(dateMs: number, timeZone?: string, opts?: Intl.DateTimeFormatOptions): string {
  try {
    const options: Intl.DateTimeFormatOptions = Object.assign({ year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short' }, opts ?? {});
    const tz = timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;
    return new Intl.DateTimeFormat(undefined, Object.assign({}, options, { timeZone: tz })).format(new Date(dateMs));
  } catch (e) {
    return new Date(dateMs).toString();
  }
}

export function startOfDay(dateMs: number, tz?: string): number {
  const d = new Date(dateMs);
  // compute based on local tz offset
  d.setHours(0,0,0,0);
  return d.getTime();
}

export function endOfDay(dateMs: number, tz?: string): number {
  const d = new Date(dateMs);
  d.setHours(23,59,59,999);
  return d.getTime();
}

export function listTimeZones(): string[] {
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (typeof Intl?.supportedValuesOf === 'function') {
      // @ts-ignore
      return Intl.supportedValuesOf('timeZone');
    }
  } catch {
    // ignore
  }
  // fallback list (common zones)
  return ['UTC','America/Los_Angeles','America/New_York','Europe/London','Europe/Paris','Asia/Tokyo','Asia/Kolkata','Australia/Sydney'];
}

export function formatTimestamp(timestamp: number, format: 'unix' | 'iso' | 'local' = 'iso'): string {
  const date = fromTimestamp(timestamp);
  switch (format) {
    case 'unix':
      return Math.floor(date.getTime() / 1000).toString();
    case 'iso':
      return date.toISOString();
    case 'local':
      return date.toLocaleString();
    default:
      return date.toISOString();
  }
}

export function getCurrentTimestamp(unit: 'seconds' | 'milliseconds' = 'seconds'): number {
  return Math.floor(Date.now() / (unit === 'seconds' ? 1000 : 1));
}

export function getRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
}

export function detectTimestampUnit(input: string): 'seconds' | 'milliseconds' | 'unknown' {
  const num = parseInt(input, 10);
  if (isNaN(num)) return 'unknown';
  if (num > 1e11) return 'milliseconds';
  if (num > 1e8) return 'seconds';
  return 'seconds';
}
