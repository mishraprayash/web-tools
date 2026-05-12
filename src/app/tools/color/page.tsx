'use client';

import * as React from 'react';
import { Copy } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { ToolLayout } from '@/components/tool/ToolLayout';
import { convertColor } from '@/tools/color/utils';
import { toast } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';

const examples = [
  { label: 'Hex colour', value: '#ff6600' },
  { label: 'RGB value', value: 'rgb(102, 51, 204)' },
  { label: 'HSL value', value: 'hsl(200, 80%, 50%)' },
  { label: 'Short hex', value: '#fff' },
];

export default function Page() {
  const [input, setInput] = React.useState(examples[0].value);
  const [activeExample, setActiveExample] = React.useState(0);
  const result = React.useMemo(() => convertColor(input), [input]);

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast({ type: 'success', message: 'Copied!' });
  };

  return (
    <ToolLayout toolId="color" name="Color Converter" description="Convert between hex, RGB and HSL colour formats" category="Formatting">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-text-muted">Examples:</span>
        {examples.map((ex, i) => (
          <button key={ex.label} onClick={() => { setActiveExample(i); setInput(ex.value); }}
            className={cn('px-3 py-1 rounded-full text-xs font-medium border transition-all',
              activeExample === i ? 'bg-accent text-bg-primary border-accent' : 'bg-bg-tertiary text-text-secondary border-border hover:border-border-hover hover:text-text-primary'
            )}>{ex.label}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-base font-medium text-text-secondary">Colour Value</h2>
          <Input value={input} onChange={(e) => { setInput(e.target.value); setActiveExample(-1); }} placeholder="#ff6600 or rgb(255,102,0)..." monospace />

          {result.success && (
            <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-bg-tertiary">
              <div className="w-12 h-12 rounded-lg border border-border shrink-0" style={{ backgroundColor: result.hex }} />
              <div className="text-xs text-text-muted">
                <span className="font-medium text-text-primary block">{result.hex}</span>
                Click any value to copy
              </div>
            </div>
          )}
          {!result.success && (
            <div className="p-4 rounded-xl bg-error/10 text-error border border-error/30 text-sm">{result.error}</div>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-base font-medium text-text-secondary">Conversions</h2>
          {result.success ? (
            <div className="space-y-2">
              {([
                { label: 'HEX', value: result.hex },
                { label: 'RGB', value: result.rgb },
                { label: 'HSL', value: result.hsl },
              ] as const).map(({ label, value }) => (
                <button key={label} onClick={() => handleCopy(value)}
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-bg-tertiary border border-border hover:bg-bg-hover transition-colors group">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-text-muted uppercase tracking-wider w-10">{label}</span>
                    <span className="text-sm font-mono text-text-primary">{value}</span>
                  </div>
                  <Copy className="h-4 w-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-40 rounded-xl bg-bg-tertiary text-text-muted text-sm">
              Enter a colour to convert
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
