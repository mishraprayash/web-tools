'use client';

import * as React from 'react';
import { Clock, Play, Pause, Copy, Check, RotateCcw } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { ExamplePills } from '@/components/ui/ExamplePills';
import { Select } from '@/components/ui/Select';
import { ToolLayout } from '@/components/tool/ToolLayout';
import { 
  getRelativeTime, 
  parseInput, 
  toEpochSeconds, 
  toEpochMilliseconds, 
  toEpochMicroseconds, 
  toEpochNanoseconds, 
  startOfDay, 
  endOfDay 
} from '@/tools/timestamp/utils';
import { toast } from '@/components/ui/Toast';

const precisionOptions = [
  { value: 'seconds', label: 'Seconds (s)' },
  { value: 'milliseconds', label: 'Milliseconds (ms)' },
  { value: 'microseconds', label: 'Microseconds (μs)' },
  { value: 'nanoseconds', label: 'Nanoseconds (ns)' },
];

const examples = [
  { label: 'Epoch (s)', value: '1716239022' },
  { label: 'Milliseconds', value: '1716239022000' },
  { label: 'Microseconds', value: '1716239022000000' },
  { label: 'Nanoseconds', value: '1716239022000000000' },
];

export default function Page() {
  const [input, setInput] = React.useState(examples[0].value);
  const [activeExample, setActiveExample] = React.useState(0);
  const [mounted, setMounted] = React.useState(false);

  // Live ticking state
  const [liveTimestamp, setLiveTimestamp] = React.useState<number>(0);
  const [isTicking, setIsTicking] = React.useState<boolean>(true);
  const [tickingPrecision, setTickingPrecision] = React.useState<'seconds' | 'milliseconds' | 'microseconds' | 'nanoseconds'>('seconds');

  React.useEffect(() => {
    setMounted(true);
    
    // Update live timestamp
    const updateTime = () => {
      const ms = Date.now();
      if (tickingPrecision === 'seconds') {
        setLiveTimestamp(Math.floor(ms / 1000));
      } else if (tickingPrecision === 'milliseconds') {
        setLiveTimestamp(ms);
      } else if (tickingPrecision === 'microseconds') {
        setLiveTimestamp(ms * 1000);
      } else {
        setLiveTimestamp(ms * 1000000);
      }
    };

    updateTime();
    
    if (isTicking) {
      const intervalMs = tickingPrecision === 'seconds' ? 1000 : 33; // Tick faster for ms/us/ns
      const id = setInterval(updateTime, intervalMs);
      return () => clearInterval(id);
    }
  }, [isTicking, tickingPrecision]);

  const parsed = mounted ? parseInput(input) : null;
  const date = parsed && parsed.success ? new Date(parsed.dateMs) : null;
  const parsedInfo = parsed ? (parsed.success ? `Detected format: ${parsed.detectedUnit}` : parsed.error) : 'Waiting for client';

  const applyExample = (i: number) => {
    setActiveExample(i);
    setInput(examples[i].value);
  };

  const handleClear = () => {
    setInput('');
    setActiveExample(-1);
  };

  const handleUseCurrentLive = () => {
    setInput(String(liveTimestamp));
    setActiveExample(-1);
    toast({ type: 'success', message: 'Loaded currently ticking timestamp!' });
  };

  const copyAll = async () => {
    if (!date) return;
    const parts = [
      `ISO String: ${date.toISOString()}`,
      `Local Format: ${date.toLocaleString()}`,
      `UTC Format: ${date.toUTCString()}`,
      `Epoch (s): ${toEpochSeconds(date.getTime())}`,
      `Epoch (ms): ${toEpochMilliseconds(date.getTime())}`,
      `Epoch (us): ${toEpochMicroseconds(date.getTime())}`,
      `Epoch (ns): ${toEpochNanoseconds(date.getTime())}`,
      `Start of Day (Local): ${new Date(startOfDay(date.getTime())).toISOString()}`,
      `End of Day (Local): ${new Date(endOfDay(date.getTime())).toISOString()}`,
    ];
    try {
      await navigator.clipboard.writeText(parts.join('\n'));
      toast({ type: 'success', message: 'Copied all timestamps to clipboard!' });
    } catch {
      toast({ type: 'error', message: 'Failed to copy to clipboard' });
    }
  };

  return (
    <ToolLayout
      name="Unix Timestamp Converter"
      description="Convert seconds, milliseconds, microseconds, or nanoseconds Unix epoch timestamps to dates and vice versa"
      category="Date & Time"
    >
      <ExamplePills examples={examples} activeIndex={activeExample} onSelect={applyExample} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-medium text-text-secondary">Live Epoch Clock</h2>
            
            <div className="flex items-center gap-2 select-none">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsTicking(!isTicking)}
                icon={isTicking ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                className={isTicking ? 'text-accent hover:text-accent-hover' : 'text-text-muted hover:text-text-primary'}
              >
                {isTicking ? 'Ticking' : 'Paused'}
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 p-5 rounded-xl bg-bg-secondary border border-border shadow-sm">
            <div className="flex items-center gap-3.5 flex-1 min-w-0">
              <Clock className="h-10 w-10 text-accent animate-pulse-glow shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-2xl font-mono font-bold tabular-nums truncate text-text-primary">
                  {liveTimestamp}
                </p>
                <p className="text-xs text-text-muted">Live ticking Unix timestamp</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-32">
                <select
                  value={tickingPrecision}
                  onChange={(e) => setTickingPrecision(e.target.value as any)}
                  className="w-full h-9 px-3 pr-8 rounded-lg bg-bg-tertiary border border-border text-text-primary text-xs focus:outline-none focus:border-accent cursor-pointer"
                >
                  {precisionOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <CopyButton value={String(liveTimestamp)} size="sm" />
              <Button variant="secondary" size="sm" onClick={handleUseCurrentLive}>
                Use
              </Button>
            </div>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-text-secondary">Input Value (Timestamp or Datetime string)</label>
              <Button variant="ghost" size="sm" onClick={handleClear} icon={<RotateCcw className="h-3.5 w-3.5" />}>
                Clear
              </Button>
            </div>
            
            <Input
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setActiveExample(-1);
              }}
              placeholder="Enter epoch timestamp or ISO 8601 string..."
              monospace
              className="min-h-[100px]"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-base font-medium text-text-secondary">Conversion Result</h2>
          
          {date ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-bg-tertiary border border-border flex items-center justify-between shadow-sm">
                <div>
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Local Calendar Date</span>
                  <p className="text-lg font-bold text-accent mt-0.5">{date.toLocaleString()}</p>
                </div>
                <CopyButton value={date.toLocaleString()} label="Copy Date" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-4 rounded-lg bg-bg-secondary border border-border">
                  <p className="text-xs text-text-muted mb-1 font-outfit">Detection Info</p>
                  <p className="text-sm font-semibold font-mono text-text-primary capitalize">{parsedInfo}</p>
                </div>

                <div className="p-4 rounded-lg bg-bg-secondary border border-border">
                  <p className="text-xs text-text-muted mb-1 font-outfit">Relative Time</p>
                  <p className="text-sm font-semibold text-text-primary">{getRelativeTime(date.getTime())}</p>
                </div>

                <div className="p-4 rounded-lg bg-bg-secondary border border-border">
                  <p className="text-xs text-text-muted mb-1 font-outfit">ISO 8601 (UTC)</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-mono break-all font-semibold">{date.toISOString()}</p>
                    <CopyButton value={date.toISOString()} size="sm" />
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-bg-secondary border border-border">
                  <p className="text-xs text-text-muted mb-1 font-outfit">UTC String</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-mono break-all font-semibold">{date.toUTCString()}</p>
                    <CopyButton value={date.toUTCString()} size="sm" />
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-bg-secondary border border-border">
                  <p className="text-xs text-text-muted mb-1 font-outfit">Epoch Seconds (s)</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-mono break-all font-semibold">{toEpochSeconds(date.getTime())}</p>
                    <CopyButton value={String(toEpochSeconds(date.getTime()))} size="sm" />
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-bg-secondary border border-border">
                  <p className="text-xs text-text-muted mb-1 font-outfit">Epoch Milliseconds (ms)</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-mono break-all font-semibold">{toEpochMilliseconds(date.getTime())}</p>
                    <CopyButton value={String(toEpochMilliseconds(date.getTime()))} size="sm" />
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-bg-secondary border border-border">
                  <p className="text-xs text-text-muted mb-1 font-outfit">Epoch Microseconds (μs)</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-mono break-all font-semibold">{toEpochMicroseconds(date.getTime())}</p>
                    <CopyButton value={String(toEpochMicroseconds(date.getTime()))} size="sm" />
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-bg-secondary border border-border">
                  <p className="text-xs text-text-muted mb-1 font-outfit">Epoch Nanoseconds (ns)</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-mono break-all font-semibold">{toEpochNanoseconds(date.getTime())}</p>
                    <CopyButton value={String(toEpochNanoseconds(date.getTime()))} size="sm" />
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-bg-secondary border border-border">
                  <p className="text-xs text-text-muted mb-1 font-outfit">Start of Day (Local)</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-mono break-all font-semibold">
                      {new Date(startOfDay(date.getTime())).toString().split(' GMT')[0]}
                    </p>
                    <CopyButton value={new Date(startOfDay(date.getTime())).toString()} size="sm" />
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-bg-secondary border border-border">
                  <p className="text-xs text-text-muted mb-1 font-outfit">End of Day (Local)</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-mono break-all font-semibold">
                      {new Date(endOfDay(date.getTime())).toString().split(' GMT')[0]}
                    </p>
                    <CopyButton value={new Date(endOfDay(date.getTime())).toString()} size="sm" />
                  </div>
                </div>

                <div className="col-span-full">
                  <Button variant="secondary" onClick={copyAll} className="w-full">
                    Copy All Date Strings
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-52 rounded-xl bg-bg-tertiary border border-border border-dashed text-text-muted text-sm italic">
              Please enter a valid Unix timestamp or date string to view the conversion details.
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
