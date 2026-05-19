'use client';

import * as React from 'react';
import { ToolLayout } from '@/components/tool/ToolLayout';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { Select } from '@/components/ui/Select';
import { GradientBox } from '@/components/ui/GradientBox';
import { 
  encodeEntities, 
  decodeEntities, 
  type EntityMode, 
  type EntityScope 
} from '@/tools/html-entities/utils';
import { toast } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';
import { Sparkles, HelpCircle, RotateCcw, AlertTriangle, ArrowRight } from 'lucide-react';

const formatOptions = [
  { value: 'named', label: 'Named Entities (e.g. &copy;)' },
  { value: 'decimal', label: 'Decimal Numeric (e.g. &#169;)' },
  { value: 'hex', label: 'Hexadecimal (e.g. &#x00A9;)' },
];

const scopeOptions = [
  { value: 'markup', label: 'Special HTML Tags only (<, >, &, ", \')' },
  { value: 'all', label: 'All non-ASCII symbols (Accents, math, currencies)' },
];

const pickerCategories = [
  {
    name: 'Standard Symbols',
    items: [
      { char: '©', code: '&copy;' },
      { char: '®', code: '&reg;' },
      { char: '™', code: '&trade;' },
      { char: '°', code: '&deg;' },
      { char: '•', code: '&bull;' },
      { char: '…', code: '&hellip;' },
      { char: '§', code: '&sect;' },
      { char: '¶', code: '&para;' },
    ]
  },
  {
    name: 'Mathematics',
    items: [
      { char: '±', code: '&plusmn;' },
      { char: '×', code: '&times;' },
      { char: '÷', code: '&divide;' },
      { char: '≈', code: '&asymp;' },
      { char: '≠', code: '&ne;' },
      { char: '≤', code: '&le;' },
      { char: '≥', code: '&ge;' },
      { char: '∞', code: '&infin;' },
      { char: '√', code: '&radic;' },
    ]
  },
  {
    name: 'Currencies',
    items: [
      { char: '€', code: '&euro;' },
      { char: '£', code: '&pound;' },
      { char: '¥', code: '&yen;' },
      { char: '¢', code: '&cent;' },
      { char: 'ƒ', code: '&fnof;' },
    ]
  },
  {
    name: 'Greek Letters',
    items: [
      { char: 'α', code: '&alpha;' },
      { char: 'β', code: '&beta;' },
      { char: 'γ', code: '&gamma;' },
      { char: 'δ', code: '&delta;' },
      { char: 'π', code: '&pi;' },
      { char: 'ω', code: '&omega;' },
    ]
  },
  {
    name: 'Arrows',
    items: [
      { char: '↑', code: '&uarr;' },
      { char: '↓', code: '&darr;' },
      { char: '←', code: '&larr;' },
      { char: '→', code: '&rarr;' },
    ]
  }
];

export default function Page() {
  const [input, setInput] = React.useState('Hello <b>World</b> & Welcome © 2026!');
  const [mode, setMode] = React.useState<'encode' | 'decode'>('encode');
  const [entityMode, setEntityMode] = React.useState<EntityMode>('named');
  const [entityScope, setEntityScope] = React.useState<EntityScope>('markup');
  
  const [output, setOutput] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const t = setTimeout(() => {
      const options = { mode: entityMode, scope: entityScope };
      const res = mode === 'encode' 
        ? encodeEntities(input, options) 
        : decodeEntities(input);
        
      if (res.success) {
        setOutput(res.data);
        setError(null);
      } else {
        setError(res.error || 'Conversion failed');
        setOutput('');
      }
    }, 80);
    return () => clearTimeout(t);
  }, [input, mode, entityMode, entityScope]);

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError(null);
  };

  const handleSwap = () => {
    if (!output || error) return;
    setMode((m) => m === 'encode' ? 'decode' : 'encode');
    setInput(output);
    setOutput('');
    setError(null);
    toast({ type: 'success', message: 'Swapped inputs and conversion roles!' });
  };

  const handleInjectSymbol = (char: string) => {
    setInput((prev) => prev + char);
    toast({ type: 'success', message: `Added symbol: ${char}` });
  };

  return (
    <ToolLayout 
      name="HTML Entities Encoder / Decoder" 
      description="Safely encode special tags and non-ASCII glyphs to HTML/XML entities or parse raw entities back to human-readable strings" 
      category="Formatting"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
        {/* Left Input Editor */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => { setMode('encode'); setOutput(''); }} 
                className={cn(
                  'h-9 px-4 rounded-lg border text-xs font-semibold transition-all duration-200',
                  mode === 'encode'
                    ? 'border-accent bg-accent/10 text-accent font-bold shadow-sm'
                    : 'border-border bg-bg-tertiary text-text-secondary hover:text-text-primary'
                )}
              >
                Encode Mode
              </button>
              <button 
                onClick={() => { setMode('decode'); setOutput(''); }} 
                className={cn(
                  'h-9 px-4 rounded-lg border text-xs font-semibold transition-all duration-200',
                  mode === 'decode'
                    ? 'border-accent bg-accent/10 text-accent font-bold shadow-sm'
                    : 'border-border bg-bg-tertiary text-text-secondary hover:text-text-primary'
                )}
              >
                Decode Mode
              </button>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleClear} icon={<RotateCcw className="h-4 w-4" />}>
                Clear
              </Button>
            </div>
          </div>

          <Input 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter entities (e.g. &lt;h1&gt;&amp;copy;&lt;/h1&gt;) to decode...'} 
            className="min-h-[220px]" 
            monospace 
          />

          {error && (
            <div className="p-4 rounded-xl bg-error/10 text-error border border-error/30 text-sm flex gap-2.5 items-start shadow-sm">
              <AlertTriangle className="h-5 w-5 shrink-0 text-error mt-0.5" />
              <p className="leading-relaxed">{error}</p>
            </div>
          )}

          {/* Encoding Settings */}
          {mode === 'encode' && (
            <div className="p-4 rounded-xl border border-border bg-bg-secondary space-y-4 shadow-sm animate-slide-up">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Entity Output Format"
                  options={formatOptions}
                  value={entityMode}
                  onChange={(e) => setEntityMode(e.target.value as EntityMode)}
                />

                <Select
                  label="Target Characters Scope"
                  options={scopeOptions}
                  value={entityScope}
                  onChange={(e) => setEntityScope(e.target.value as EntityScope)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Output Panel & Symbols Picker Directory */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-medium text-text-secondary">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent font-bold">
                Converted Output
              </span>
            </h2>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleSwap} disabled={!output || !!error} icon={<ArrowRight className="h-4 w-4" />}>
                Swap
              </Button>
              <CopyButton value={output} disabled={!output} />
            </div>
          </div>

          <GradientBox value={output} placeholder="HTML output will appear here..." className="min-h-[220px]" />

          {/* Special Characters Picker Directory */}
          {mode === 'encode' && (
            <div className="p-5 rounded-xl border border-border bg-bg-secondary shadow-sm space-y-4 animate-fade-in select-none">
              <div className="flex items-center justify-between border-b border-border pb-2.5">
                <span className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5 font-outfit">
                  <Sparkles className="h-4 w-4 text-accent animate-pulse-glow" />
                  <span>Special Symbols Directory Picker</span>
                </span>
                <span className="text-[9px] text-text-muted uppercase font-bold tracking-wider">Click to inject</span>
              </div>

              <div className="space-y-4 max-h-[220px] overflow-y-auto pr-1">
                {pickerCategories.map((category) => (
                  <div key={category.name} className="space-y-2">
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block font-sans">
                      {category.name}
                    </span>
                    
                    <div className="flex flex-wrap gap-2">
                      {category.items.map((item) => (
                        <button
                          key={item.char}
                          onClick={() => handleInjectSymbol(item.char)}
                          className="w-10 h-10 rounded-lg border border-border/80 bg-bg-tertiary hover:bg-bg-hover hover:border-accent flex flex-col items-center justify-center transition-all group"
                          title={`Click to add ${item.char} (Entity: ${item.code})`}
                        >
                          <span className="text-base text-text-primary group-hover:text-accent font-bold">
                            {item.char}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
