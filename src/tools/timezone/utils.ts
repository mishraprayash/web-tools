export interface TimezoneInfo {
  name: string;
  label: string;
  offset: string;
  abbr: string;
  region: string;
}

export type ConvertResult =
  | { success: true; source: TimezoneInfo; target: TimezoneInfo; sourceTime: string; targetTime: string; date: Date }
  | { success: false; error: string };

export function getTimezones(): TimezoneInfo[] {
  try {
    const raw = Intl.supportedValuesOf('timeZone');
    return raw.map((tz) => formatTimezoneInfo(tz));
  } catch {
    return [];
  }
}

export function getGroupedTimezones(): Record<string, TimezoneInfo[]> {
  const all = getTimezones();
  const groups: Record<string, TimezoneInfo[]> = {};
  for (const tz of all) {
    const region = tz.region;
    if (!groups[region]) groups[region] = [];
    groups[region].push(tz);
  }
  return groups;
}

function formatTimezoneInfo(tz: string): TimezoneInfo {
  const region = tz.includes('/') ? tz.split('/')[0] : 'Other';
  const now = new Date();
  const offset = getTimezoneOffsetStr(tz, now);
  const abbr = getTimezoneAbbr(tz, now);
  const label = tz.replace(/_/g, ' ');
  return { name: tz, label, offset, abbr, region };
}

export function getTimezoneOffsetStr(tz: string, date: Date = new Date()): string {
  try {
    const formatter = new Intl.DateTimeFormat('en', {
      timeZone: tz,
      timeZoneName: 'longOffset',
    });
    const parts = formatter.formatToParts(date);
    const offsetPart = parts.find((p) => p.type === 'timeZoneName');
    const raw = offsetPart?.value ?? '';
    const m = raw.match(/UTC([+-]\d{1,2}):?(\d{2})?/);
    if (m) {
      const hours = m[1];
      const mins = m[2] || '00';
      return `UTC${hours}:${mins}`;
    }
    return 'UTC';
  } catch {
    return 'UTC';
  }
}

export function getTimezoneAbbr(tz: string, date: Date = new Date()): string {
  try {
    const formatter = new Intl.DateTimeFormat('en', {
      timeZone: tz,
      timeZoneName: 'short',
    });
    const parts = formatter.formatToParts(date);
    const abbr = parts.find((p) => p.type === 'timeZoneName');
    return abbr?.value ?? '';
  } catch {
    return '';
  }
}

export function convertTime(
  date: Date,
  fromTz: string,
  toTz: string,
): ConvertResult {
  if (isNaN(date.getTime())) {
    return { success: false, error: 'Invalid date' };
  }

  try {
    const sourceFormatter = new Intl.DateTimeFormat('en', {
      timeZone: fromTz,
      dateStyle: 'full',
      timeStyle: 'medium',
    });
    const targetFormatter = new Intl.DateTimeFormat('en', {
      timeZone: toTz,
      dateStyle: 'full',
      timeStyle: 'medium',
    });

    const sourceInfo = formatTimezoneInfo(fromTz);
    const targetInfo = formatTimezoneInfo(toTz);

    return {
      success: true,
      source: sourceInfo,
      target: targetInfo,
      sourceTime: sourceFormatter.format(date),
      targetTime: targetFormatter.format(date),
      date,
    };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}

export function getCommonTimezones(): TimezoneInfo[] {
  const common = [
    'UTC',
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'America/Anchorage',
    'Pacific/Honolulu',
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'Europe/Moscow',
    'Asia/Dubai',
    'Asia/Kolkata',
    'Asia/Shanghai',
    'Asia/Tokyo',
    'Asia/Singapore',
    'Australia/Sydney',
    'Pacific/Auckland',
  ];
  return common.map(formatTimezoneInfo);
}
