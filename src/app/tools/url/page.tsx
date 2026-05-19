'use client';

import * as React from 'react';
import { RotateCcw, Plus, Trash2, Settings, ArrowRight, Table, Sparkles, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { GradientBox } from '@/components/ui/GradientBox';
import { ExamplePills } from '@/components/ui/ExamplePills';
import { ToolLayout } from '@/components/tool/ToolLayout';
import { 
  encodeUrlStr, 
  decodeUrlStr, 
  parseUrl, 
  rebuildUrl, 
  type UrlMode, 
  type QueryParam 
} from '@/tools/url/utils';
import { toast } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';

const examples = [
  { label: 'API Search Query', value: 'https://api.example.com/v1/search?q=developer suite&limit=25&active=true#results' },
  { label: 'Oauth Callback', value: 'https://auth.company.org/callback?code=AUTH_49d28e&state=success_2026' },
  { label: 'Encoded Query', value: 'https%3A%2F%2Fexample.com%2Fpath%3Fkey%3Dhello%20world%21' },
];

const modeOptions = [
  { value: 'component', label: 'Component mode (encodeURIComponent)' },
  { value: 'uri', label: 'Complete URL mode (encodeURI)' },
  { value: 'strict', label: 'Strict RFC 3986 encoding' },
];

export default function Page() {
  const [input, setInput] = React.useState(examples[0].value);
  const [action, setAction] = React.useState<'encode' | 'decode'>('encode');
  const [mode, setMode] = React.useState<UrlMode>('component');
  const [activeExample, setActiveExample] = React.useState(0);
  
  // Real-time parsed query params states
  const [baseUrl, setBaseUrl] = React.useState('');
  const [params, setParams] = React.useState<QueryParam[]>([]);
  const [hash, setHash] = React.useState('');

  const [output, setOutput] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);

  // Sync input to parsed grid params
  React.useEffect(() => {
    if (!input.trim()) {
      setBaseUrl('');
      setParams([]);
      setHash('');
      return;
    }
    const parsed = parseUrl(input);
    setBaseUrl(parsed.baseUrl);
    setParams(parsed.params);
    setHash(parsed.hash);
  }, [input]);

  // Synchronise table param updates back to raw input URL
  const syncTableToInput = (updatedParams: QueryParam[], updatedBaseUrl = baseUrl, updatedHash = hash) => {
    const rawUrl = rebuildUrl(updatedBaseUrl, updatedParams, updatedHash);
    setInput(rawUrl);
    setActiveExample(-1);
  };

  const handleProcess = React.useCallback(() => {
    if (!input.trim()) {
      setOutput('');
      setError(null);
      return;
    }

    try {
      const res = action === 'encode' 
        ? encodeUrlStr(input, mode) 
        : decodeUrlStr(input, mode);
      
      setOutput(res);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
    }
  }, [input, action, mode]);

  React.useEffect(() => {
    const t = setTimeout(handleProcess, 100);
    return () => clearTimeout(t);
  }, [handleProcess]);

  const applyExample = (i: number) => {
    setActiveExample(i);
    setInput(examples[i].value);
    
    // Automatically switch action based on example format
    if (examples[i].value.includes('%3A')) {
      setAction('decode');
    } else {
      setAction('encode');
    }
    setError(null);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError(null);
    setActiveExample(-1);
  };

  const handleSwap = () => {
    if (!output || error) return;
    setAction((a) => a === 'encode' ? 'decode' : 'encode');
    setInput(output);
    setOutput('');
    setError(null);
    setActiveExample(-1);
    toast({ type: 'success', message: 'Swapped inputs and conversion roles!' });
  };

  // Grid param inline handlers
  const handleParamChange = (id: string, field: 'key' | 'value', value: string) => {
    const nextParams = params.map(p => {
      if (p.id === id) {
        return { ...p, [field]: value };
      }
      return p;
    });
    setParams(nextParams);
    syncTableToInput(nextParams);
  };

  const handleAddParam = () => {
    const newParam: QueryParam = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      key: '',
      value: ''
    };
    const nextParams = [...params, newParam];
    setParams(nextParams);
    syncTableToInput(nextParams);
    toast({ type: 'success', message: 'Added new query parameter row!' });
  };

  const handleDeleteParam = (id: string) => {
    const nextParams = params.filter(p => p.id !== id);
    setParams(nextParams);
    syncTableToInput(nextParams);
    toast({ type: 'success', message: 'Parameter deleted!' });
  };

  const handleBaseUrlChange = (val: string) => {
    setBaseUrl(val);
    syncTableToInput(params, val);
  };

  const handleHashChange = (val: string) => {
    setHash(val);
    syncTableToInput(params, baseUrl, val);
  };

  return (
    <ToolLayout 
      name="URL Encoder / Decoder & Query Linter" 
      description="Encode/decode URL strings, select strict RFC 3986 compliance modes, and parse or edit API query parameters interactively in real-time" 
      category="Encoding"
    >
      <ExamplePills examples={examples} activeIndex={activeExample} onSelect={applyExample} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Inputs & Query Parameter grid linter */}
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => { setAction('encode'); setOutput(''); }} 
                className={cn(
                  'h-9 px-4 rounded-lg border text-xs font-semibold transition-all duration-200',
                  action === 'encode'
                    ? 'border-accent bg-accent/10 text-accent font-bold shadow-sm'
                    : 'border-border bg-bg-tertiary text-text-secondary hover:text-text-primary'
                )}
              >
                Encode URL
              </button>
              <button 
                onClick={() => { setAction('decode'); setOutput(''); }} 
                className={cn(
                  'h-9 px-4 rounded-lg border text-xs font-semibold transition-all duration-200',
                  action === 'decode'
                    ? 'border-accent bg-accent/10 text-accent font-bold shadow-sm'
                    : 'border-border bg-bg-tertiary text-text-secondary hover:text-text-primary'
                )}
              >
                Decode URL
              </button>
            </div>
            
            <Button variant="ghost" size="sm" onClick={handleClear} icon={<RotateCcw className="h-4 w-4" />}>
              Clear
            </Button>
          </div>

          <Input 
            value={input} 
            onChange={(e) => { setInput(e.target.value); setActiveExample(-1); }} 
            placeholder={action === 'encode' ? 'Enter raw URL to encode...' : 'Enter percent-encoded URL to decode...'} 
            className="min-h-[120px]" 
            monospace
          />

          {error && (
            <div className="p-4 rounded-xl bg-error/10 text-error border border-error/30 text-sm flex gap-2.5 items-start shadow-sm animate-fade-in">
              <AlertCircle className="h-5 w-5 shrink-0 text-error mt-0.5" />
              <p className="leading-relaxed">{error}</p>
            </div>
          )}

          {/* Interactive Query Parameter Editor Grid (extremely premium!) */}
          {baseUrl && (
            <div className="p-4 rounded-xl border border-border bg-bg-secondary space-y-4 shadow-sm animate-slide-up">
              <div className="flex items-center justify-between border-b border-border pb-2.5 select-none">
                <span className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5 font-outfit">
                  <Table className="h-4.5 w-4.5 text-accent animate-pulse-glow" />
                  <span>Interactive Query Parameter Editor</span>
                </span>
                
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={handleAddParam}
                  className="h-7 text-[10px] font-bold bg-bg-tertiary border border-border"
                  icon={<Plus className="h-3.5 w-3.5" />}
                >
                  Add Param
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-border/60 pb-3">
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold text-text-muted mb-1.5 uppercase tracking-wider">Base Request URL</label>
                  <input
                    type="text"
                    value={baseUrl}
                    onChange={(e) => handleBaseUrlChange(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full h-9 px-3 rounded-lg bg-bg-tertiary border border-border text-xs font-mono text-text-primary focus:outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-text-muted mb-1.5 uppercase tracking-wider">Hash route (#)</label>
                  <input
                    type="text"
                    value={hash}
                    onChange={(e) => handleHashChange(e.target.value)}
                    placeholder="#section"
                    className="w-full h-9 px-3 rounded-lg bg-bg-tertiary border border-border text-xs font-mono text-text-primary focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              {/* Parameters list table */}
              <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1">
                {params.length > 0 ? (
                  params.map((p) => (
                    <div key={p.id} className="flex items-center gap-3 animate-fade-in">
                      <input
                        type="text"
                        value={p.key}
                        onChange={(e) => handleParamChange(p.id, 'key', e.target.value)}
                        placeholder="parameter_name"
                        className="flex-1 h-9 px-3 rounded-lg bg-bg-tertiary border border-border text-xs font-mono text-text-primary focus:outline-none focus:border-accent font-bold"
                      />
                      <span className="text-xs text-text-muted font-bold select-none">=</span>
                      <input
                        type="text"
                        value={p.value}
                        onChange={(e) => handleParamChange(p.id, 'value', e.target.value)}
                        placeholder="value"
                        className="flex-1 h-9 px-3 rounded-lg bg-bg-tertiary border border-border text-xs font-mono text-text-primary focus:outline-none focus:border-accent"
                      />
                      
                      <button
                        onClick={() => handleDeleteParam(p.id)}
                        className="p-2 rounded-lg border border-border bg-bg-tertiary hover:bg-error/15 text-text-secondary hover:text-error hover:border-error/30 transition-all shrink-0 cursor-pointer"
                        title="Delete parameter"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-text-muted/50 py-3.5 italic text-xs select-none">
                    No query parameters parsed in the URL. Click 'Add Param' to build queries.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mode parameters settings */}
          <div className="p-4 rounded-xl border border-border bg-bg-secondary space-y-4 shadow-sm select-none">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-text-primary font-outfit border-b border-border pb-2.5">
              <Settings className="h-4 w-4 text-accent animate-pulse-glow" />
              <span>URL Compliance Specifications</span>
            </div>

            <Select
              label="Encoding Specifications"
              options={modeOptions}
              value={mode}
              onChange={(e) => setMode(e.target.value as UrlMode)}
            />
          </div>
        </div>

        {/* Right Output Panel */}
        <div className="space-y-4">
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

          <GradientBox value={output} placeholder="URL output will appear here..." className="min-h-[280px]" />
          
          {output && (
            <span className="text-xs text-text-muted font-medium block">
              {output.length.toLocaleString()} characters · {output.split('\n').length.toLocaleString()} lines
            </span>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
