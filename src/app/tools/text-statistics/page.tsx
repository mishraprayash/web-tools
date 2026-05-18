'use client';

import * as React from 'react';
import { ToolLayout } from '@/components/tool/ToolLayout';
import { TextViewer } from '@/components/ui/TextViewer';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { analyzeText } from '@/tools/text-statistics/utils';

export default function Page() {
  const [input, setInput] = React.useState('');
  const [stats, setStats] = React.useState<any>(null);

  React.useEffect(() => {
    const t = setTimeout(() => {
      const res = analyzeText(input);
      if (res.success) setStats(res.data);
      else setStats(null);
    }, 120);
    return () => clearTimeout(t);
  }, [input]);

  const handleClear = () => { setInput(''); };

  return (
    <ToolLayout name="Text Statistics" description="Quick stats: words, chars, lines, reading time" category="Text">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-medium text-text-secondary">Input</h2>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleClear}>Clear</Button>
              <CopyButton value={input} label="Copy" disabled={!input} />
            </div>
          </div>
          <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Paste your text here" className="min-h-[320px]" monospace />
        </div>

        <div className="space-y-4">
          <h2 className="text-base font-medium text-text-secondary">Statistics</h2>
          <div className="grid grid-cols-2 gap-3">
            <Stat label="Characters" value={stats?.chars ?? 0} />
            <Stat label="Chars (no spaces)" value={stats?.charsNoSpaces ?? 0} />
            <Stat label="Words" value={stats?.words ?? 0} />
            <Stat label="Lines" value={stats?.lines ?? 0} />
            <Stat label="Paragraphs" value={stats?.paragraphs ?? 0} />
            <Stat label="Read (min)" value={stats?.readingTimeMinutes ?? 0} />
          </div>

          <div>
            <h3 className="text-sm text-text-secondary mb-2">Preview</h3>
            <TextViewer value={input} minHeight="180px" maxHeight="320px" placeholder="No text to preview" />
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="p-3 bg-bg-tertiary border border-border rounded-lg">
      <div className="text-xs text-text-muted">{label}</div>
      <div className="mt-1 text-lg font-medium font-mono">{value}</div>
    </div>
  );
}
