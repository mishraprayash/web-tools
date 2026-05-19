'use client';

import * as React from 'react';
import { RotateCcw, AlertTriangle, ShieldCheck, Binary, Sliders, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { ExamplePills } from '@/components/ui/ExamplePills';
import { ToolLayout } from '@/components/tool/ToolLayout';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { 
  convertNumber, 
  toTwosComplement, 
  formatLabel, 
  type NumberBase 
} from '@/tools/number-base/utils';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/Toast';

const examples = [
  { label: 'Decimal 255', value: '255', base: 'decimal' as NumberBase },
  { label: 'Hex FF', value: 'FF', base: 'hex' as NumberBase },
  { label: 'Binary 101010', value: '101010', base: 'binary' as NumberBase },
  { label: 'Octal 777', value: '777', base: 'octal' as NumberBase },
  { label: '64-bit Pointer (Hex)', value: '7FFF8D3C4020', base: 'hex' as NumberBase },
];

const basesOptions = [
  { value: 'decimal', label: 'Decimal (DEC)' },
  { value: 'hex', label: 'Hexadecimal (HEX)' },
  { value: 'binary', label: 'Binary (BIN)' },
  { value: 'octal', label: 'Octal (OCT)' },
];

export default function Page() {
  const [input, setInput] = React.useState(examples[0].value);
  const [from, setFrom] = React.useState<NumberBase>('decimal');
  const [customBase, setCustomBase] = React.useState<number>(12); // Base 12 Duodecimal by default
  const [bitSize, setBitSize] = React.useState<8 | 16 | 32 | 64>(16); // 16-bit by default
  const [activeExample, setActiveExample] = React.useState(0);

  const result = React.useMemo(() => {
    return convertNumber(input, from, customBase);
  }, [input, from, customBase]);

  const twosComplementResult = React.useMemo(() => {
    if (result.success) {
      return toTwosComplement(result.decimal, bitSize);
    }
    return null;
  }, [result, bitSize]);

  const applyExample = (i: number) => {
    setActiveExample(i);
    setFrom(examples[i].base);
    setInput(examples[i].value);
  };

  const handleClear = () => {
    setInput('');
    setActiveExample(-1);
  };

  return (
    <ToolLayout 
      name="Number Base & 2's Complement Converter" 
      description="Convert arbitrarily large BigInt values between custom bases 2 to 36, and visualize binary bits in Signed/Unsigned 2's complement structures" 
      category="Encoding"
    >
      <ExamplePills examples={examples} activeIndex={activeExample} onSelect={applyExample} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side Inputs */}
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-medium text-text-secondary">Input Sizing Value</h2>
            <Button variant="ghost" size="sm" onClick={handleClear} icon={<RotateCcw className="h-4 w-4" />}>
              Reset
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-text-muted mb-1.5 uppercase">Source Sizing Input</label>
              <Input 
                value={input} 
                onChange={(e) => { setInput(e.target.value); setActiveExample(-1); }}
                placeholder={from === 'decimal' ? '255' : from === 'hex' ? 'FF' : from === 'binary' ? '11111111' : '377'}
                monospace 
              />
            </div>
            
            <Select
              label="Source Base"
              options={basesOptions}
              value={from}
              onChange={(e) => { setFrom(e.target.value as NumberBase); setActiveExample(-1); }}
            />
          </div>

          {!result.success && result.error && (
            <div className="p-4 rounded-xl bg-error/10 text-error border border-error/30 text-xs flex gap-2.5 items-start shadow-sm animate-fade-in">
              <AlertTriangle className="h-5 w-5 shrink-0 text-error mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-bold">Parsing Error</span>
                <p className="leading-relaxed">{result.error}</p>
              </div>
            </div>
          )}

          {/* Arbitrary Base slider option */}
          <div className="p-4 rounded-xl border border-border bg-bg-secondary space-y-4 shadow-sm select-none">
            <div className="flex items-center justify-between border-b border-border pb-2.5">
              <span className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5 font-outfit">
                <Sliders className="h-4 w-4 text-accent" />
                <span>Arbitrary Custom Radix (Base 2 - 36)</span>
              </span>
              <span className="text-xs font-mono text-accent font-extrabold bg-accent/10 px-2 py-0.5 rounded border border-accent/20">
                Base {customBase}
              </span>
            </div>

            <div className="space-y-2">
              <input
                type="range"
                min="2"
                max="36"
                value={customBase}
                onChange={(e) => setCustomBase(parseInt(e.target.value, 10))}
                className="w-full h-2 rounded-lg bg-bg-tertiary appearance-none cursor-pointer accent-accent border border-border"
              />
              <div className="flex justify-between text-[10px] font-mono text-text-muted px-1">
                <span>Base 2 (Binary)</span>
                <span>Base 10 (Dec)</span>
                <span>Base 16 (Hex)</span>
                <span>Base 36 (Max)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Conversions Output & 2's Complement Simulator */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-medium text-text-secondary">Conversions Output</h2>
          </div>

          {result.success ? (
            <div className="space-y-5 animate-fade-in">
              <div className="space-y-2.5">
                {[
                  { label: 'Decimal', key: 'decimal', badge: 'DEC', color: 'text-green-500 border-green-500/30 bg-green-500/10' },
                  { label: 'Hexadecimal', key: 'hex', badge: 'HEX', color: 'text-amber-500 border-amber-500/30 bg-amber-500/10' },
                  { label: 'Binary', key: 'binary', badge: 'BIN', color: 'text-cyan-500 border-cyan-500/30 bg-cyan-500/10' },
                  { label: 'Octal', key: 'octal', badge: 'OCT', color: 'text-purple-500 border-purple-500/30 bg-purple-500/10' },
                  ...(result.custom ? [{ label: `Custom Base ${customBase}`, key: 'custom', badge: `BASE ${customBase}`, color: 'text-accent border-accent/30 bg-accent/10' }] : [])
                ].map((item) => {
                  const val = (result as any)[item.key] as string;
                  return (
                    <CopyButton 
                      key={item.key} 
                      value={val} 
                      variant="ghost" 
                      className="w-full flex items-center justify-between p-3.5 rounded-xl bg-bg-tertiary border border-border hover:bg-bg-hover transition-all"
                    >
                      <div className="flex items-center gap-3.5 flex-1 min-w-0 pr-4">
                        <span className={cn('text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded border shrink-0', item.color)}>
                          {item.badge}
                        </span>
                        <span className="text-sm font-mono text-text-primary truncate font-bold select-all leading-none mt-0.5">
                          {val}
                        </span>
                      </div>
                    </CopyButton>
                  );
                })}
              </div>

              {/* 2's Complement Simulator panel */}
              {twosComplementResult && (
                <div className="p-5 rounded-xl border border-border bg-bg-tertiary space-y-4 shadow-sm select-none">
                  <div className="flex items-center justify-between border-b border-border pb-2.5">
                    <span className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5 font-outfit">
                      <Binary className="h-4.5 w-4.5 text-accent animate-pulse-glow" />
                      <span>Systems Integer &amp; 2's Complement Simulator</span>
                    </span>
                  </div>

                  <div className="space-y-3.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-text-muted font-semibold">Integer Bit width:</span>
                      <div className="flex rounded-lg border border-border p-0.5 bg-bg-secondary shrink-0">
                        {([8, 16, 32, 64] as const).map((size) => (
                          <button
                            key={size}
                            onClick={() => setBitSize(size)}
                            className={cn(
                              'px-2.5 py-1 rounded-md text-[10px] font-bold transition-all duration-150',
                              bitSize === size
                                ? 'bg-accent text-white shadow-sm'
                                : 'text-text-secondary hover:text-text-primary'
                            )}
                          >
                            {size}-bit
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border border-border bg-bg-secondary space-y-3">
                      {/* Formatted Binary bits chunks */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Bit Array Representation</span>
                        <pre className="text-xs font-bold font-mono text-accent bg-bg-tertiary p-2 rounded-lg border border-border overflow-x-auto select-all leading-normal">
                          {twosComplementResult.binary}
                        </pre>
                      </div>

                      <div className="grid grid-cols-2 gap-3.5">
                        <div className="p-2.5 rounded-lg bg-bg-tertiary border border-border/80">
                          <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider">Signed value (2's Comp)</span>
                          <p className="text-sm font-bold font-mono text-text-primary truncate mt-0.5">{twosComplementResult.signed}</p>
                        </div>
                        
                        <div className="p-2.5 rounded-lg bg-bg-tertiary border border-border/80">
                          <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider">Unsigned value</span>
                          <p className="text-sm font-bold font-mono text-text-primary truncate mt-0.5">{twosComplementResult.unsigned}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 rounded-xl bg-bg-tertiary border border-border border-dashed text-text-muted text-sm italic">
              Please enter a valid numeric input on the left to inspect number systems.
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
