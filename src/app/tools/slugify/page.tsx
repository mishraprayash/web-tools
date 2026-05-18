'use client';

import * as React from 'react';
import { ToolLayout } from '@/components/tool/ToolLayout';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { slugifyResult } from '@/tools/slugify/utils';

export default function Page() {
  const [input, setInput] = React.useState('');
  const [output, setOutput] = React.useState('');

  React.useEffect(() => {
    const t = setTimeout(() => {
      const res = slugifyResult(input);
      if (res.success) setOutput(res.data);
      else setOutput('');
    }, 80);
    return () => clearTimeout(t);
  }, [input]);

  const handleClear = () => { setInput(''); };

  return (
    <ToolLayout name="Slugify" description="Generate URL-friendly slugs from text" category="Text">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-medium text-text-secondary">Input</h2>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleClear}>Clear</Button>
            </div>
          </div>
          <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Write title or text..." className="min-h-[160px]" monospace />
        </div>

        <div className="space-y-4">
          <h2 className="text-base font-medium text-text-secondary">Output</h2>
          <div className="p-3 bg-bg-tertiary border border-border rounded-lg font-mono text-sm break-words">{output || <span className="text-text-muted">Slug will appear here</span>}</div>
          <div className="flex items-center gap-2">
            <CopyButton value={output} label="Copy" disabled={!output} />
            <Button onClick={() => { navigator.clipboard.writeText(output || '').then(()=>{}) }} disabled={!output}>Copy (alt)</Button>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
