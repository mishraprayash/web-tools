'use client';

import * as React from 'react';
import { ToolLayout } from '@/components/tool/ToolLayout';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { encodeEntities, decodeEntities } from '@/tools/html-entities/utils';

export default function Page() {
  const [input, setInput] = React.useState('');
  const [mode, setMode] = React.useState<'encode'|'decode'>('encode');
  const [output, setOutput] = React.useState('');

  React.useEffect(() => {
    const t = setTimeout(() => {
      const res = mode === 'encode' ? encodeEntities(input) : decodeEntities(input);
      if (res.success) setOutput(res.data);
      else setOutput('');
    }, 80);
    return () => clearTimeout(t);
  }, [input, mode]);

  const handleClear = () => setInput('');

  return (
    <ToolLayout name="HTML Entities" description="Encode or decode HTML entities safely" category="Formatting">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={() => setMode('encode')} className={`px-3 py-1 rounded ${mode==='encode'? 'bg-accent text-bg-primary' : 'bg-bg-tertiary text-text-secondary'}`}>Encode</button>
            <button onClick={() => setMode('decode')} className={`px-3 py-1 rounded ${mode==='decode'? 'bg-accent text-bg-primary' : 'bg-bg-tertiary text-text-secondary'}`}>Decode</button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleClear}>Clear</Button>
            <CopyButton value={input} label="Copy" disabled={!input} />
          </div>
        </div>

        <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter HTML or text" className="min-h-[160px]" monospace />

        <h3 className="text-sm text-text-secondary">Result</h3>
        <div className="p-3 bg-bg-tertiary border border-border rounded-lg font-mono text-sm break-words">{output || <span className="text-text-muted">Output will appear here</span>}</div>
        <div className="flex items-center gap-2">
          <CopyButton value={output} label="Copy" disabled={!output} />
          <Button onClick={() => { navigator.clipboard.writeText(output || ''); }} disabled={!output}>Copy (alt)</Button>
        </div>
      </div>
    </ToolLayout>
  );
}
