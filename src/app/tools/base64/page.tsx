'use client';

import * as React from 'react';
import { Copy, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { GradientBox } from '@/components/ui/GradientBox';
import { ToolLayout } from '@/components/tool/ToolLayout';
import { processBase64, Base64Action } from '@/tools/base64/utils';
import { toast } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';

interface Example { label: string; action: Base64Action; urlSafe: boolean; input: string; }

const examples: Example[] = [
  { label: 'Encode text', action: 'encode', urlSafe: false, input: 'Hello, World!' },
  { label: 'Encode JSON', action: 'encode', urlSafe: false, input: '{"user":"alice","role":"admin"}' },
  { label: 'Decode Base64', action: 'decode', urlSafe: false, input: 'SGVsbG8sIFdvcmxkIQ==' },
  { label: 'URL-safe decode', action: 'decode', urlSafe: true, input: 'SGVsbG8sIFdvcmxkIQ' },
];

const actions: { value: Base64Action; label: string }[] = [
  { value: 'encode', label: 'Encode' },
  { value: 'decode', label: 'Decode' },
];

export default function Page() {
  const [input, setInput] = React.useState(examples[0].input);
  const [output, setOutput] = React.useState('');
  const [action, setAction] = React.useState<Base64Action>(examples[0].action);
  const [urlSafe, setUrlSafe] = React.useState(examples[0].urlSafe);
  const [activeExample, setActiveExample] = React.useState(0);

  React.useEffect(() => {
    if (!input.trim()) { setOutput(''); return; }
    setOutput(processBase64(input, action, urlSafe));
  }, [input, action, urlSafe]);

  const applyExample = (i: number) => {
    setActiveExample(i);
    setAction(examples[i].action);
    setUrlSafe(examples[i].urlSafe);
    setInput(examples[i].input);
  };

  const handleClear = () => { setInput(''); setOutput(''); };
  const handleCopy = async () => { await navigator.clipboard.writeText(output); toast({ type: 'success', message: 'Copied!' }); };

  return (
    <ToolLayout toolId="base64" name="Base64 Encoder / Decoder" description="Encode and decode Base64 strings, including URL-safe variants" category="Encoding">
      {/* Example pills */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-text-muted">Examples:</span>
        {examples.map((ex, i) => (
          <button key={ex.label} onClick={() => applyExample(i)}
            className={cn('px-3 py-1 rounded-full text-xs font-medium border transition-all',
              activeExample === i
                ? 'bg-accent text-bg-primary border-accent'
                : 'bg-bg-tertiary text-text-secondary border-border hover:border-border-hover hover:text-text-primary'
            )}>
            {ex.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-medium text-text-secondary">Input</h2>
            <Button variant="ghost" size="sm" onClick={handleClear} icon={<RotateCcw className="h-4 w-4" />}>Clear</Button>
          </div>
          <Input value={input} onChange={(e) => { setInput(e.target.value); setActiveExample(-1); }}
            placeholder={action === 'encode' ? 'Enter text to encode...' : 'Enter Base64 to decode...'}
            className="min-h-[200px]" />
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex gap-2">
              {actions.map(a => (
                <Button key={a.value} variant={action === a.value ? 'primary' : 'secondary'} size="sm" onClick={() => setAction(a.value)}>
                  {a.label}
                </Button>
              ))}
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={urlSafe} onChange={(e) => setUrlSafe(e.target.checked)}
                className="w-4 h-4 rounded border-border bg-bg-tertiary accent-accent" />
              <span className="text-sm text-text-secondary">URL-safe</span>
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-medium text-text-secondary">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">Output</span>
            </h2>
            <Button variant="ghost" size="sm" onClick={handleCopy} disabled={!output} icon={<Copy className="h-4 w-4" />}>Copy</Button>
          </div>
          <GradientBox value={output} />
          <span className="text-xs text-text-muted">{output.length.toLocaleString()} characters</span>
        </div>
      </div>
    </ToolLayout>
  );
}
