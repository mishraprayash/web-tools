'use client';

import * as React from 'react';
import { Input } from '@/components/ui/Input';
import { ToolLayout } from '@/components/tool/ToolLayout';
import { cn } from '@/lib/utils';

const cronFields = [
  { name: 'minute', range: '0-59' },
  { name: 'hour', range: '0-23' },
  { name: 'day of month', range: '1-31' },
  { name: 'month', range: '1-12' },
  { name: 'day of week', range: '0-6' },
];

const examples = [
  { label: 'Every minute', value: '* * * * *' },
  { label: 'Weekdays 9 AM', value: '0 9 * * 1-5' },
  { label: 'Every 15 min', value: '*/15 * * * *' },
  { label: 'Monthly midnight', value: '0 0 1 * *' },
];

function parseCron(expr: string): string {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return 'Invalid cron expression';
  const [minute, hour, day, month, dow] = parts;
  const desc: string[] = [];
  if (minute === '*') desc.push('Every minute');
  else if (minute.includes(',')) desc.push(`At minutes: ${minute}`);
  else if (minute.includes('-')) desc.push(`Minutes ${minute}`);
  else desc.push(`At minute ${minute}`);
  if (hour === '*') desc.push('every hour');
  else if (hour.includes(',')) desc.push(`at hours: ${hour}`);
  else desc.push(`at ${hour}:00`);
  if (day === '*') desc.push('every day');
  else desc.push(`on day ${day}`);
  if (month === '*') desc.push('every month');
  else desc.push(`in month ${month}`);
  if (dow === '*') desc.push('every day of week');
  else {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    if (!isNaN(parseInt(dow))) desc.push(`on ${days[parseInt(dow)]}`);
  }
  return desc.join(', ');
}

export default function Page() {
  const [input, setInput] = React.useState(examples[1].value);
  const [activeExample, setActiveExample] = React.useState(1);

  return (
    <ToolLayout toolId="cron" name="Cron Parser" description="Translate cron expressions into plain English" category="Date & Time">
      {/* Example pills */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-text-muted">Examples:</span>
        {examples.map((ex, i) => (
          <button key={ex.label} onClick={() => { setActiveExample(i); setInput(ex.value); }}
            className={cn('px-3 py-1 rounded-full text-xs font-medium border transition-all',
              activeExample === i
                ? 'bg-accent text-bg-primary border-accent'
                : 'bg-bg-tertiary text-text-secondary border-border hover:border-border-hover hover:text-text-primary'
            )}>
            {ex.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <Input value={input} onChange={(e) => { setInput(e.target.value); setActiveExample(-1); }} placeholder="* * * * *" monospace />

        {input && (
          <div className="p-5 rounded-xl bg-bg-tertiary border border-border">
            <h3 className="text-sm font-medium text-text-secondary mb-2">Description</h3>
            <p className="text-text-primary">{parseCron(input)}</p>
          </div>
        )}

        <div className="p-5 rounded-xl bg-bg-secondary border border-border">
          <h3 className="text-sm font-medium mb-2">Format</h3>
          <p className="text-text-secondary text-sm font-mono mb-3">minute &nbsp; hour &nbsp; day &nbsp; month &nbsp; dow</p>
          <div className="grid grid-cols-5 gap-2">
            {cronFields.map(f => (
              <div key={f.name} className="text-center p-2 rounded-lg bg-bg-tertiary">
                <p className="text-[10px] text-text-muted uppercase tracking-wider">{f.name}</p>
                <p className="text-xs font-mono text-text-secondary mt-0.5">{f.range}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
