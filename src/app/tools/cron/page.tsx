'use client';

import * as React from 'react';
import { Input } from '@/components/ui/Input';
import { ExamplePills } from '@/components/ui/ExamplePills';
import { ToolLayout } from '@/components/tool/ToolLayout';
const cronFields = [
  { name: 'second', range: '0-59' },
  { name: 'minute', range: '0-59' },
  { name: 'hour', range: '0-23' },
  { name: 'day of month', range: '1-31' },
  { name: 'month', range: '1-12' },
  { name: 'day of week', range: '0-6' },
];

const examples = [
  { label: 'Every second', value: '* * * * * *' },
  { label: 'Weekdays 9 AM', value: '0 0 9 * * 1-5' },
  { label: 'Every 15 seconds', value: '*/15 * * * * *' },
  { label: 'Monthly midnight', value: '0 0 0 1 * *' },
];

function parseDayOfWeek(dow: string): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  if (dow === '*') return 'every day of week';
  
  const parsePart = (part: string): string => {
    if (part.includes(',')) {
      return part.split(',').map(parsePart).join(', ');
    }
    if (part.includes('/')) {
      const [, interval] = part.split('/');
      if (interval) {
        const base = part.startsWith('*') ? '' : parsePart(part.split('/')[0]);
        const suffix = `every ${interval} days`;
        return base ? `${base}, ${suffix}` : suffix;
      }
    }
    if (part.includes('-')) {
      const [start, end] = part.split('-').map(Number);
      const range = days.slice(start, end + 1);
      if (range.length === 2) return `${range[0]} or ${range[1]}`;
      return `${range.slice(0, -1).join(', ')} and ${range[range.length - 1]}`;
    }
    if (!isNaN(parseInt(part))) {
      return days[parseInt(part)];
    }
    return part;
  };
  
  return parsePart(dow);
}

function parseCron(expr: string): string {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 6) return 'Invalid cron expression';
  const [second, minute, hour, day, month, dow] = parts;
  const desc: string[] = [];
  
  if (second === '*') desc.push('Every second');
  else if (second.includes(',')) desc.push(`At second(s): ${second}`);
  else if (second.includes('-')) desc.push(`Seconds ${second}`);
  else if (second.includes('/')) desc.push(`Every ${second.split('/')[1]} seconds`);
  else desc.push(`At second ${second}`);
  
  if (minute === '*') desc.push('every minute');
  else if (minute.includes(',')) desc.push(`at minute(s): ${minute}`);
  else if (minute.includes('-')) desc.push(`Minutes ${minute}`);
  else if (minute.includes('/')) desc.push(`Every ${minute.split('/')[1]} minutes`);
  else desc.push(`at minute ${minute}`);
  
  if (hour === '*') desc.push('every hour');
  else if (hour.includes(',')) desc.push(`at hour(s): ${hour}`);
  else if (hour.includes('-')) desc.push(`Hours ${hour}`);
  else if (hour.includes('/')) desc.push(`Every ${hour.split('/')[1]} hours`);
  else desc.push(`at ${hour}:00`);
  
  if (day === '*') desc.push('every day');
  else if (day.includes(',')) desc.push(`on day(s): ${day}`);
  else if (day.includes('-')) desc.push(`Days ${day}`);
  else if (day.includes('/')) desc.push(`Every ${day.split('/')[1]} days`);
  else desc.push(`on day ${day}`);
  
  if (month === '*') desc.push('every month');
  else if (month.includes(',')) desc.push(`in month(s): ${month}`);
  else if (month.includes('-')) desc.push(`Months ${month}`);
  else if (month.includes('/')) desc.push(`Every ${month.split('/')[1]} months`);
  else desc.push(`in month ${month}`);
  
  desc.push(parseDayOfWeek(dow));
  
  return desc.join(', ');
}

export default function Page() {
  const [input, setInput] = React.useState(examples[1].value);
  const [activeExample, setActiveExample] = React.useState(1);

  return (
    <ToolLayout name="Cron Parser" description="Translate cron expressions into plain English" category="Date & Time">
      <ExamplePills examples={examples} activeIndex={activeExample} onSelect={(i) => { setActiveExample(i); setInput(examples[i].value); }} />

      <div className="space-y-4">
        <Input value={input} onChange={(e) => { setInput(e.target.value); setActiveExample(-1); }} placeholder="* * * * * *" monospace />

        {input && (
          <div className="p-5 rounded-xl bg-bg-tertiary border border-border">
            <h3 className="text-sm font-medium text-text-secondary mb-2">Description</h3>
            <p className="text-text-primary">{parseCron(input)}</p>
          </div>
        )}

        <div className="p-5 rounded-xl bg-bg-secondary border border-border">
          <h3 className="text-sm font-medium mb-2">Format</h3>
          <p className="text-text-secondary text-sm font-mono mb-3">second &nbsp; minute &nbsp; hour &nbsp; day &nbsp; month &nbsp; dow</p>
          <div className="grid grid-cols-6 gap-2">
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
