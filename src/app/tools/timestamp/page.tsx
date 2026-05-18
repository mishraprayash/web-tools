'use client';

import * as React from 'react';
import { Clock } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { ExamplePills } from '@/components/ui/ExamplePills';
import { ToolLayout } from '@/components/tool/ToolLayout';
import { getRelativeTime, parseInput, toEpochMilliseconds, toEpochSeconds, startOfDay, endOfDay } from '@/tools/timestamp/utils';
import { CopyButton } from '@/components/ui/CopyButton';
const examples = [
  { label: 'Epoch (s)', value: '1716239022' },
  { label: 'Milliseconds', value: '1716239022000' },
  { label: 'Year 2000', value: '946684800' },
  { label: 'Now', value: '' }, // dynamic, filled on click
];

export default function Page() {
  const [input, setInput] = React.useState(examples[0].value);
  const [timestamp, setTimestamp] = React.useState<number | null>(null);
  const [activeExample, setActiveExample] = React.useState(0);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    // avoid using Date/Intl on server to prevent hydration mismatch
    setMounted(true);
    // client-only initialization

    // initialize and start live unix timestamp (seconds)
    setTimestamp(Math.floor(Date.now() / 1000));
    const id = setInterval(() => setTimestamp(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(id);
  }, []);

  const parsed = mounted ? parseInput(input) : null;
  const date = parsed && parsed.success ? new Date(parsed.dateMs) : null;
  const parsedInfo = parsed ? (parsed.success ? `Detected: ${parsed.detectedUnit}` : parsed.error) : 'Waiting for client';

  const applyExample = (i: number) => {
    setActiveExample(i);
    setInput(examples[i].value || String(Math.floor(Date.now() / 1000)));
  };

  const handleDateTimeLocal = (v: string) => {
    // v is like "2026-05-18T12:34"
    if (!v) return;
    const ms = new Date(v).getTime();
    if (!isNaN(ms)) {
      // store milliseconds to preserve precision
      setInput(String(ms));
    }
  };

  const copyAll = async () => {
    if (!date) return;
    const parts = [
      `ISO: ${date.toISOString()}`,
      `Epoch (s): ${toEpochSeconds(date.getTime())}`,
      `Epoch (ms): ${toEpochMilliseconds(date.getTime())}`,
      `Start of day: ${new Date(startOfDay(date.getTime())).toISOString()}`,
      `End of day: ${new Date(endOfDay(date.getTime())).toISOString()}`,
    ];
    try {
      await navigator.clipboard.writeText(parts.join('\n'));
    } catch {
      // ignore
    }
  };

  return (
    <ToolLayout name="Unix Timestamp Converter" description="Convert between Unix timestamps and human-readable dates" category="Date & Time">
      <ExamplePills examples={examples} activeIndex={activeExample} onSelect={applyExample} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-base font-medium text-text-secondary">Current Time</h2>
          <div className="flex items-center gap-4 p-6 rounded-xl bg-bg-tertiary">
            <Clock className="h-12 w-12 text-accent animate-pulse shrink-0" />
            <div>
              <p className="text-2xl font-mono font-bold tabular-nums">{timestamp}</p>
              <p className="text-xs text-text-muted">Current Unix timestamp</p>
            </div>
            <div className="ml-auto w-48">
              {/* timezone selector removed per request */}
            </div>
          </div>
          <div>
            <label className="text-sm text-text-secondary mb-1.5 block">Convert</label>
            <Input value={input} onChange={(e) => { setInput(e.target.value); setActiveExample(-1); }} placeholder="Enter timestamp..." monospace />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-base font-medium text-text-secondary">Result</h2>
          {date ? (
            <div className="space-y-3">
                <div className="p-4 rounded-lg bg-bg-tertiary text-lg font-mono flex items-center justify-between">
                <div>{date.toLocaleString()}</div>
                <div className="ml-4"><CopyButton value={date.toISOString()} label="Copy ISO" /></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-lg bg-bg-tertiary border border-border">
                  <p className="text-xs text-text-muted mb-1">Parse info</p>
                  <p className="text-xs font-mono break-all">{parsedInfo}</p>
                </div>
                <div className="p-4 rounded-lg bg-bg-tertiary border border-border">
                  <p className="text-xs text-text-muted mb-1">ISO String</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-mono break-all">{date.toISOString()}</p>
                    <CopyButton value={date.toISOString()} label="Copy" />
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-bg-tertiary border border-border">
                  <p className="text-xs text-text-muted mb-1">Relative</p>
                  <p className="text-sm">{getRelativeTime(date.getTime())}</p>
                </div>
                <div className="p-4 rounded-lg bg-bg-tertiary border border-border">
                  <p className="text-xs text-text-muted mb-1">Epoch (s)</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-mono break-all">{toEpochSeconds(date.getTime())}</p>
                    <CopyButton value={String(toEpochSeconds(date.getTime()))} label="Copy" />
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-bg-tertiary border border-border">
                  <p className="text-xs text-text-muted mb-1">Epoch (ms)</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-mono break-all">{toEpochMilliseconds(date.getTime())}</p>
                    <CopyButton value={String(toEpochMilliseconds(date.getTime()))} label="Copy" />
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-bg-tertiary border border-border">
                  <p className="text-xs text-text-muted mb-1">Start of day</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-mono break-all">{new Date(startOfDay(date.getTime())).toISOString()}</p>
                    <CopyButton value={new Date(startOfDay(date.getTime())).toISOString()} label="Copy" />
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-bg-tertiary border border-border">
                  <p className="text-xs text-text-muted mb-1">End of day</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-mono break-all">{new Date(endOfDay(date.getTime())).toISOString()}</p>
                    <CopyButton value={new Date(endOfDay(date.getTime())).toISOString()} label="Copy" />
                  </div>
                </div>
                <div className="col-span-full flex items-center gap-2">
                  <button onClick={copyAll} className="px-3 py-1 rounded bg-accent text-bg-primary">Copy all</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-40 rounded-lg bg-bg-tertiary text-text-muted text-sm">
              Enter a timestamp to convert
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
