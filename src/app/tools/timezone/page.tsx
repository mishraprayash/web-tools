'use client';

import * as React from 'react';
import { ArrowLeftRight, Clock, Search, Check } from 'lucide-react';
import { ToolLayout } from '@/components/tool/ToolLayout';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { convertTime, getCommonTimezones, getGroupedTimezones, type TimezoneInfo } from '@/tools/timezone/utils';

const commonTzs = getCommonTimezones();
const LOCAL_TZ = Intl.DateTimeFormat().resolvedOptions().timeZone;

function formatLocalDateTime(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const h = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${d}T${h}:${min}`;
}

export default function Page() {
  const [fromTz, setFromTz] = React.useState(LOCAL_TZ);
  const [toTz, setToTz] = React.useState('UTC');
  const [dateStr, setDateStr] = React.useState(() => formatLocalDateTime(new Date()));
  const [resultIndex, setResultIndex] = React.useState(0);

  const grouped = React.useMemo(() => getGroupedTimezones(), []);

  const result = React.useMemo(() => {
    const d = new Date(dateStr);
    return convertTime(d, fromTz, toTz);
  }, [dateStr, fromTz, toTz]);

  const swapTimezones = React.useCallback(() => {
    setFromTz(toTz);
    setToTz(fromTz);
  }, [toTz, fromTz]);

  const pickCommon = React.useCallback((tz: string) => {
    if (resultIndex === 0) {
      setToTz(tz);
    } else {
      setFromTz(tz);
    }
  }, [resultIndex]);

  const setNow = React.useCallback(() => {
    setDateStr(formatLocalDateTime(new Date()));
  }, []);

  return (
    <ToolLayout name="Time Zone Converter" description="Convert time across time zones around the world" category="Date & Time">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setResultIndex(0)}
              className={resultIndex === 0 ? 'text-accent' : ''}>
              From
            </Button>
            <span className="text-text-muted text-sm">→</span>
            <Button variant="ghost" size="sm" onClick={() => setResultIndex(1)}
              className={resultIndex === 1 ? 'text-accent' : ''}>
              To
            </Button>
          </div>

          <div className="flex items-end gap-2">
            <div className="flex-1">
              <label className="text-xs text-text-muted mb-1.5 block">From</label>
              <SearchableTimezoneSelect value={fromTz} onChange={setFromTz} groups={grouped} />
            </div>

            <button onClick={swapTimezones}
              className="p-2 rounded-lg bg-bg-tertiary border border-border hover:border-accent transition-colors mb-0.5">
              <ArrowLeftRight className="h-4 w-4 text-text-secondary" />
            </button>

            <div className="flex-1">
              <label className="text-xs text-text-muted mb-1.5 block">To</label>
              <SearchableTimezoneSelect value={toTz} onChange={setToTz} groups={grouped} />
            </div>
          </div>

          <div>
            <label className="text-xs text-text-muted mb-1.5 block">Date &amp; Time</label>
            <div className="flex gap-2">
              <div className="flex-1">
                <input type="datetime-local" value={dateStr} onChange={(e) => setDateStr(e.target.value)}
                  className={cn(
                    'w-full h-10 px-4 rounded-lg bg-bg-tertiary border border-border',
                    'text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30',
                    'transition-all duration-200 [color-scheme:dark]'
                  )} />
              </div>
              <Button variant="secondary" size="sm" onClick={setNow}>
                Now
              </Button>
            </div>
          </div>

          <div>
            <label className="text-xs text-text-muted mb-1.5 block">Quick Convert</label>
            <div className="flex flex-wrap gap-1.5">
              {commonTzs.slice(0, 8).map((tz) => (
                <button key={tz.name} onClick={() => pickCommon(tz.name)}
                  className="px-2.5 py-1 rounded-full text-xs bg-bg-tertiary border border-border hover:border-accent hover:text-accent transition-colors">
                  {tz.abbr || (tz.name.split('/').pop() ?? '')}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-base font-medium text-text-secondary">Converted Time</h2>

          {result.success ? (
            <div className="space-y-4">
              <div className="p-6 rounded-xl bg-bg-tertiary border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-text-muted">{result.source.offset}</span>
                  <span className="text-xs text-text-muted">{result.source.label}</span>
                </div>
                <p className="text-lg font-semibold font-outfit">{result.sourceTime}</p>
              </div>

              <div className="flex justify-center">
                <ArrowLeftRight className="h-5 w-5 text-accent" />
              </div>

              <div className="p-6 rounded-xl bg-accent/5 border border-accent/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-text-muted">{result.target.offset}</span>
                  <span className="text-xs text-text-muted">{result.target.label}</span>
                </div>
                <p className="text-lg font-semibold font-outfit text-accent">{result.targetTime}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-40 rounded-lg bg-bg-tertiary text-text-muted text-sm">
              {result.error}
            </div>
          )}

          <div className="p-5 rounded-xl bg-bg-secondary border border-border">
            <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Clock className="h-4 w-4 text-accent" /> Common Conversions
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {commonTzs.map((tz) => {
                const c = convertTime(new Date(dateStr), LOCAL_TZ, tz.name);
                if (!c.success) return null;
                const shortName = tz.abbr || (tz.name.split('/').pop() ?? '');
                return (
                  <div key={tz.name} className="p-2 rounded-lg bg-bg-tertiary text-xs">
                    <span className="text-text-muted">{shortName}</span>
                    <p className="font-mono text-text-primary">{c.targetTime.split(' at ')[1] || c.targetTime}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

interface SearchableTimezoneSelectProps {
  value: string;
  onChange: (v: string) => void;
  groups: Record<string, TimezoneInfo[]>;
}

function SearchableTimezoneSelect({ value, onChange, groups }: SearchableTimezoneSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const flatList = React.useMemo(() => {
    const items: ({ type: 'item' } & TimezoneInfo)[] = [];
    for (const [, tzs] of Object.entries(groups)) {
      for (const tz of tzs) {
        items.push({ ...tz, type: 'item' });
      }
    }
    return items;
  }, [groups]);

  const selected = React.useMemo(
    () => flatList.find((tz) => tz.name === value),
    [flatList, value],
  );

  const filtered = React.useMemo(() => {
    if (!query.trim()) return null;
    const q = query.toLowerCase();
    return flatList.filter(
      (tz) =>
        tz.label.toLowerCase().includes(q) ||
        tz.name.toLowerCase().includes(q) ||
        tz.offset.toLowerCase().includes(q) ||
        tz.abbr.toLowerCase().includes(q) ||
        tz.region.toLowerCase().includes(q),
    );
  }, [flatList, query]);

  React.useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSelect = React.useCallback(
    (tzName: string) => {
      onChange(tzName);
      setOpen(false);
      setQuery('');
    },
    [onChange],
  );

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        setQuery('');
      }
    },
    [],
  );

  return (
    <div ref={containerRef} className="relative" onKeyDown={handleKeyDown}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          'w-full h-10 px-4 pr-10 rounded-lg bg-bg-tertiary border border-border text-left',
          'text-text-primary cursor-pointer',
          'focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30',
          'transition-all duration-200 flex items-center gap-2',
        )}>
        <span className="truncate flex-1 text-sm">
          {selected ? `${selected.label} (${selected.offset})` : value}
        </span>
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          className="text-text-muted shrink-0">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50 rounded-lg border border-border bg-bg-secondary shadow-lg max-h-80 flex flex-col">
          <div className="relative p-2 border-b border-border">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search timezones..."
              className="w-full h-9 pl-8 pr-3 rounded-md bg-bg-tertiary border border-border text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
            />
          </div>

          <div className="overflow-y-auto flex-1">
            {query.trim() ? (
              filtered && filtered.length > 0 ? (
                <div className="py-1">
                  {filtered.map((tz) => (
                    <button
                      key={tz.name}
                      type="button"
                      onClick={() => handleSelect(tz.name)}
                      className={cn(
                        'w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors',
                        tz.name === value
                          ? 'bg-accent/10 text-accent'
                          : 'text-text-primary hover:bg-bg-hover',
                      )}>
                      <span className={cn(
                        'w-4 h-4 flex items-center justify-center shrink-0',
                        tz.name === value ? 'text-accent' : 'text-transparent',
                      )}>
                        {tz.name === value && <Check className="h-3.5 w-3.5" />}
                      </span>
                      <span className="flex-1 truncate">{tz.label}</span>
                      <span className="text-xs text-text-muted shrink-0">{tz.offset}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-sm text-text-muted">
                  No timezones match &ldquo;{query}&rdquo;
                </div>
              )
            ) : (
              <div className="py-1">
                {Object.entries(groups).map(([region, tzs]) => (
                  <div key={region}>
                    <div className="px-3 py-1.5 text-xs text-text-muted uppercase tracking-wider font-medium">
                      {region}
                    </div>
                    {tzs.map((tz) => (
                      <button
                        key={tz.name}
                        type="button"
                        onClick={() => handleSelect(tz.name)}
                        className={cn(
                          'w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors',
                          tz.name === value
                            ? 'bg-accent/10 text-accent'
                            : 'text-text-primary hover:bg-bg-hover',
                        )}>
                        <span className={cn(
                          'w-4 h-4 flex items-center justify-center shrink-0',
                          tz.name === value ? 'text-accent' : 'text-transparent',
                        )}>
                          {tz.name === value && <Check className="h-3.5 w-3.5" />}
                        </span>
                        <span className="flex-1 truncate">{tz.label}</span>
                        <span className="text-xs text-text-muted shrink-0">{tz.offset}</span>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
