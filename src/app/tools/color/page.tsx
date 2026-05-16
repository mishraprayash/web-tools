'use client';

import * as React from 'react';
import { Pipette, Sun, Moon } from 'lucide-react';
import { CopyButton } from '@/components/ui/CopyButton';
import { Input } from '@/components/ui/Input';
import { ExamplePills } from '@/components/ui/ExamplePills';
import { ToolLayout } from '@/components/tool/ToolLayout';
import { convertColor, type HarmonyColor } from '@/tools/color/utils';
import { cn } from '@/lib/utils';

const examples = [
  { label: 'Orange', value: '#ff6600' },
  { label: 'Blue', value: 'rgb(33, 150, 243)' },
  { label: 'Green', value: 'hsl(120, 60%, 50%)' },
  { label: 'Purple', value: '#8e44ad' },
  { label: 'Teal', value: 'rgba(0, 150, 136, 0.6)' },
];

function formatContrast(ratio: number): string {
  if (ratio >= 7) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  if (ratio >= 3) return 'AA Large';
  return 'Fail';
}

function formatLuminance(l: number): string {
  return l.toFixed(3);
}

function HarmonySwatch({ color }: { color: HarmonyColor }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className="w-8 h-8 rounded-lg border border-border shrink-0 cursor-pointer"
        style={{ backgroundColor: color.hex }}
        title={color.hsl}
      />
      <span className="text-[10px] text-text-muted text-center leading-tight">{color.name}</span>
    </div>
  );
}

export default function Page() {
  const [input, setInput] = React.useState(examples[0].value);
  const [activeExample, setActiveExample] = React.useState(0);
  const result = React.useMemo(() => convertColor(input), [input]);

  const formats = result.success
    ? [
        { label: 'HEX', value: result.hex },
        { label: 'HEXA', value: result.hexa },
        { label: 'RGB', value: result.rgb },
        { label: 'RGBA', value: result.rgba },
        { label: 'HSL', value: result.hsl },
        { label: 'HSLA', value: result.hsla },
      ]
    : [];

  const uniqueHarmonies = result.success
    ? result.harmonies.filter(
        (c, i, arr) => arr.findIndex((h) => h.name === c.name) === i,
      )
    : [];

  return (
    <ToolLayout name="Color Converter" description="Convert, preview, and analyse colors across HEX, RGB, HSL and alpha variants" category="Formatting">
      <ExamplePills examples={examples} activeIndex={activeExample} onSelect={(i) => { setActiveExample(i); setInput(examples[i].value); }} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-base font-medium text-text-secondary">Colour Value</h2>

          {result.success && (
            <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-bg-tertiary">
              <div className="relative shrink-0">
                <div className="absolute inset-0 rounded-lg bg-[repeating-conic-gradient(#808080_0%_25%,transparent_0%_50%)_50%/8px_8px]" />
                <div className="relative w-16 h-16 rounded-lg border-2 border-border" style={{ backgroundColor: result.hex }} />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-lg font-mono font-medium text-text-primary block truncate">{result.hex}</span>
                <span className="text-xs text-text-muted">{result.a < 1 ? `Alpha: ${result.a}` : 'Opaque'}</span>
              </div>
              <input type="color" value={result.hex} onChange={(e) => { setInput(e.target.value); setActiveExample(-1); }}
                className="w-9 h-9 rounded-lg cursor-pointer border border-border bg-transparent p-0.5 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-md [&::-webkit-color-swatch]:border-none" />
            </div>
          )}

          <Input value={input} onChange={(e) => { setInput(e.target.value); setActiveExample(-1); }}
            placeholder="#ff6600 or rgb(255, 102, 0)..."
            monospace />

          {!result.success && (
            <div className="p-4 rounded-xl bg-error/10 text-error border border-error/30 text-sm">{result.error}</div>
          )}

          {result.success && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-success/15 text-success border border-success/30">
                <Pipette className="h-3 w-3" /> R: {result.r} G: {result.g} B: {result.b}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-accent/15 text-accent border border-accent/30">
                H: {result.h}° S: {result.s}% L: {result.l}%
              </span>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-base font-medium text-text-secondary">Formats</h2>
          {result.success ? (
            <div className="space-y-2">
              {formats.map(({ label, value }) => (
                <CopyButton key={label} value={value} variant="ghost" className="w-full flex items-center justify-between p-4 rounded-xl bg-bg-tertiary border border-border hover:bg-bg-hover transition-colors">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-xs font-medium text-text-muted uppercase tracking-wider w-12 shrink-0">{label}</span>
                    <span className="text-sm font-mono text-text-primary truncate">{value}</span>
                  </div>
                </CopyButton>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-40 rounded-xl bg-bg-tertiary text-text-muted text-sm">
              Enter a colour to convert
            </div>
          )}

          {result.success && (
            <>
              <div className="p-4 rounded-xl bg-bg-tertiary border border-border">
                <h3 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-3">Accessibility</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-bg-secondary">
                    <div className="flex items-center gap-2 mb-1">
                      <Sun className="h-3.5 w-3.5 text-yellow-400" />
                      <span className="text-xs text-text-secondary">On white</span>
                    </div>
                    <span className={cn('text-sm font-mono',
                      result.contrastOnWhite >= 4.5 ? 'text-success' : result.contrastOnWhite >= 3 ? 'text-warning' : 'text-error'
                    )}>
                      {result.contrastOnWhite}:1
                    </span>
                    <span className="text-xs text-text-muted ml-2">({formatContrast(result.contrastOnWhite)})</span>
                  </div>
                  <div className="p-3 rounded-lg bg-bg-secondary">
                    <div className="flex items-center gap-2 mb-1">
                      <Moon className="h-3.5 w-3.5 text-text-muted" />
                      <span className="text-xs text-text-secondary">On black</span>
                    </div>
                    <span className={cn('text-sm font-mono',
                      result.contrastOnBlack >= 4.5 ? 'text-success' : result.contrastOnBlack >= 3 ? 'text-warning' : 'text-error'
                    )}>
                      {result.contrastOnBlack}:1
                    </span>
                    <span className="text-xs text-text-muted ml-2">({formatContrast(result.contrastOnBlack)})</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3 text-xs text-text-muted">
                  <span>Luminance:</span>
                  <span className="font-mono text-text-primary">{formatLuminance(result.luminance)}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-bg-tertiary border border-border">
                <h3 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-3">Harmonies</h3>
                <div className="flex items-start gap-4 flex-wrap">
                  {uniqueHarmonies.map((color) => (
                    <HarmonySwatch key={`${color.name}-${color.hex}`} color={color} />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
