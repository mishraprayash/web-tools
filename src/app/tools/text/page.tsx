'use client';

import * as React from 'react';
import { Input } from '@/components/ui/Input';
import { ToolLayout } from '@/components/tool/ToolLayout';
import { cn } from '@/lib/utils';

const cases = [
  { name: 'UPPERCASE', fn: (s: string) => s.toUpperCase() },
  { name: 'lowercase', fn: (s: string) => s.toLowerCase() },
  { name: 'Sentence case', fn: (s: string) => s.replace(/(^\s*\w|[.!?]\s*\w)/g, (c: string) => c.toUpperCase()) },
  { name: 'Title Case', fn: (s: string) => s.replace(/\w\S*/g, (t: string) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()) },
  { name: 'camelCase', fn: (s: string) => s.replace(/[-_\s]+(.)?/g, (_: string, c: string) => c ? c.toUpperCase() : '').replace(/^./, (c: string) => c.toLowerCase()) },
  { name: 'snake_case', fn: (s: string) => s.replace(/([A-Z])/g, '_$1').replace(/[-\s]+/g, '_').toLowerCase().replace(/^_/, '') },
];

const examples = [
  { label: 'Simple phrase', value: 'hello world example' },
  { label: 'A sentence', value: 'the quick brown fox jumps over the lazy dog' },
  { label: 'CamelCase', value: 'myVariableName' },
  { label: 'A title', value: 'the lord of the rings: the fellowship of the ring' },
];

export default function Page() {
  const [input, setInput] = React.useState(examples[0].value);
  const [activeExample, setActiveExample] = React.useState(0);

  return (
    <ToolLayout toolId="text" name="Text Case Converter" description="Convert text to camelCase, snake_case, Title Case, UPPERCASE and more" category="Text">
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
        <Input value={input} onChange={(e) => { setInput(e.target.value); setActiveExample(-1); }} placeholder="Enter text..." className="min-h-[120px]" />

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {cases.map(c => (
            <div key={c.name} className="p-4 rounded-xl bg-bg-tertiary border border-border">
              <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1.5">{c.name}</p>
              <p className="text-sm font-mono break-all">{input ? c.fn(input) : <span className="text-text-muted">-</span>}</p>
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}
