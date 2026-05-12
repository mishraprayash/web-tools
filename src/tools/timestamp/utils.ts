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