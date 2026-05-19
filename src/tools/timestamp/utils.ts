export function toTimestamp(date: Date | string | number): number {
  if (typeof date === 'number') return date;
  if (typeof date === 'string') {
    const parsed = new Date(date);
    return parsed.getTime();
  }
  return date.getTime();
}

export function fromTimestamp(timestamp: number, unit: 'seconds' | 'milliseconds' | 'microseconds' | 'nanoseconds' = 'seconds'): Date {
  switch (unit) {
    case 'seconds':
      return new Date(timestamp * 1000);
    case 'milliseconds':
      return new Date(timestamp);
    case 'microseconds':
      return new Date(Math.floor(timestamp / 1000));
    case 'nanoseconds':
      return new Date(Math.floor(timestamp / 1000000));
  }
}

export type ParseResult = { 
  success: true; 
  dateMs: number; 
  originalVal: number;
  detectedUnit: 'seconds' | 'milliseconds' | 'microseconds' | 'nanoseconds' | 'unknown'; 
} | { success: false; error: string };

export function parseInput(input: string): ParseResult {
  if (!input || input.trim() === '') return { success: false, error: 'Empty input' };
  const s = input.trim();

  // numeric -> timestamp
  if (/^-?\d+$/.test(s)) {
    const num = parseInt(s, 10);
    const unit = detectTimestampUnit(s);
    if (unit === 'nanoseconds') return { success: true, dateMs: Math.floor(num / 1000000), originalVal: num, detectedUnit: 'nanoseconds' };
    if (unit === 'microseconds') return { success: true, dateMs: Math.floor(num / 1000), originalVal: num, detectedUnit: 'microseconds' };
    if (unit === 'milliseconds') return { success: true, dateMs: num, originalVal: num, detectedUnit: 'milliseconds' };
    if (unit === 'seconds') return { success: true, dateMs: num * 1000, originalVal: num, detectedUnit: 'seconds' };
    return { success: true, dateMs: num, originalVal: num, detectedUnit: 'unknown' };
  }

  // try Date.parse for ISO / RFC / common strings
  const parsed = Date.parse(s);
  if (!isNaN(parsed)) return { success: true, dateMs: parsed, originalVal: parsed, detectedUnit: 'unknown' };

  return { success: false, error: 'Unable to parse input as timestamp or date string' };
}

export function toEpochSeconds(dateMs: number): number {
  return Math.floor(dateMs / 1000);
}

export function toEpochMilliseconds(dateMs: number): number {
  return dateMs;
}

export function toEpochMicroseconds(dateMs: number): number {
  return dateMs * 1000;
}

export function toEpochNanoseconds(dateMs: number): number {
  return dateMs * 1000000;
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

export function startOfDay(dateMs: number): number {
  const d = new Date(dateMs);
  d.setHours(0,0,0,0);
  return d.getTime();
}

export function endOfDay(dateMs: number): number {
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
  return ['UTC','America/Los_Angeles','America/New_York','Europe/London','Europe/Paris','Asia/Tokyo','Asia/Kolkata','Australia/Sydney'];
}

export function formatTimestamp(timestamp: number, format: 'unix' | 'iso' | 'local' = 'iso'): string {
  const date = new Date(timestamp);
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

export function getRelativeTime(timestampMs: number): string {
  const now = Date.now();
  const diff = now - timestampMs;
  const absDiff = Math.abs(diff);
  const seconds = Math.floor(absDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  const isFuture = diff < 0;
  const prefix = isFuture ? 'in ' : '';
  const suffix = isFuture ? '' : ' ago';

  if (seconds < 5) return 'just now';
  
  if (years > 0) return `${prefix}${years} year${years > 1 ? 's' : ''}${suffix}`;
  if (months > 0) return `${prefix}${months} month${months > 1 ? 's' : ''}${suffix}`;
  if (days > 0) return `${prefix}${days} day${days > 1 ? 's' : ''}${suffix}`;
  if (hours > 0) return `${prefix}${hours} hour${hours > 1 ? 's' : ''}${suffix}`;
  if (minutes > 0) return `${prefix}${minutes} minute${minutes > 1 ? 's' : ''}${suffix}`;
  return `${prefix}${seconds} second${seconds > 1 ? 's' : ''}${suffix}`;
}

export function detectTimestampUnit(input: string): 'seconds' | 'milliseconds' | 'microseconds' | 'nanoseconds' | 'unknown' {
  const cleanStr = input.trim();
  if (!/^-?\d+$/.test(cleanStr)) return 'unknown';
  const len = cleanStr.replace('-', '').length;
  if (len <= 10) return 'seconds';
  if (len <= 13) return 'milliseconds';
  if (len <= 16) return 'microseconds';
  return 'nanoseconds';
}
