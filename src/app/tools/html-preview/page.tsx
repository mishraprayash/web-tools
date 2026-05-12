'use client';

import * as React from 'react';
import { Copy } from 'lucide-react';
import { ToolLayout } from '@/components/tool/ToolLayout';
import { sanitizeHtml, wrapHtmlDocument } from '@/tools/html-preview/utils';
import { toast } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';

const examples = [
  { label: 'Simple card', value: '<div style="padding:20px;border-radius:12px;background:linear-gradient(135deg,#667eea,#764ba2);color:white;font-family:sans-serif;max-width:300px"><h2>Hello!</h2><p>This is a live preview.</p><button style="padding:8px 16px;border-radius:6px;border:none;background:white;color:#667eea;cursor:pointer">Click me</button></div>' },
  { label: 'Table', value: '<table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;font-family:sans-serif"><tr style="background:#f0f0f0"><th>Name</th><th>Role</th><th>Status</th></tr><tr><td>Alice</td><td>Admin</td><td style="color:green">Active</td></tr><tr><td>Bob</td><td>Editor</td><td style="color:orange">Pending</td></tr></table>' },
  { label: 'Typography', value: '<h1>Heading 1</h1><h2>Heading 2</h2><p style="font-size:16px;line-height:1.6">This is a paragraph with <strong>bold</strong>, <em>italic</em>, and <a href="#">a link</a>. Lorem ipsum dolor sit amet.</p><blockquote style="border-left:4px solid #667eea;padding-left:16px;margin:16px 0;color:#666">A blockquote example for preview.</blockquote><code style="background:#f5f5f5;padding:2px 6px;border-radius:4px">inline code</code>' },
  { label: 'Full document', value: '<!DOCTYPE html><html><head><style>body{font-family:sans-serif;max-width:600px;margin:40px auto;padding:0 20px;line-height:1.6}h1{color:#333}footer{margin-top:40px;padding-top:20px;border-top:1px solid #eee;color:#999;font-size:14px}</style></head><body><h1>Full Document</h1><p>This is a complete HTML document with styles.</p><footer>&copy; 2024 DevTools Pro</footer></body></html>' },
];

export default function Page() {
  const [input, setInput] = React.useState(examples[0].value);
  const [activeExample, setActiveExample] = React.useState(0);
  const [showSource, setShowSource] = React.useState(false);

  const iframeRef = React.useRef<HTMLIFrameElement>(null);
  const srcdoc = React.useMemo(() => wrapHtmlDocument(input), [input]);

  return (
    <ToolLayout toolId="html-preview" name="HTML Preview" description="Write HTML and see it rendered live with an inline preview" category="Formatting">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-text-muted">Examples:</span>
        {examples.map((ex, i) => (
          <button key={ex.label} onClick={() => { setActiveExample(i); setInput(ex.value); }}
            className={cn('px-3 py-1 rounded-full text-xs font-medium border transition-all',
              activeExample === i ? 'bg-accent text-bg-primary border-accent' : 'bg-bg-tertiary text-text-secondary border-border hover:border-border-hover hover:text-text-primary'
            )}>{ex.label}</button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex gap-1.5">
          <button onClick={() => setShowSource(false)}
            className={cn('px-3 py-1.5 text-xs font-medium rounded-lg border transition-all',
              !showSource ? 'bg-accent text-bg-primary border-accent' : 'bg-bg-tertiary text-text-secondary border-border'
            )}>Preview</button>
          <button onClick={() => setShowSource(true)}
            className={cn('px-3 py-1.5 text-xs font-medium rounded-lg border transition-all',
              showSource ? 'bg-accent text-bg-primary border-accent' : 'bg-bg-tertiary text-text-secondary border-border'
            )}>Source</button>
        </div>
        <button onClick={async () => { await navigator.clipboard.writeText(input); toast({ type: 'success', message: 'Copied!' }); }}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-border bg-bg-tertiary text-text-secondary hover:border-border-hover hover:text-text-primary transition-all">
          <Copy className="h-3.5 w-3.5" /> Copy HTML
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h2 className="text-base font-medium text-text-secondary">HTML</h2>
          <textarea value={input} onChange={(e) => { setInput(e.target.value); setActiveExample(-1); }}
            placeholder="<h1>Hello World</h1>"
            className="w-full h-[400px] p-4 rounded-xl bg-bg-tertiary border border-border text-sm font-mono text-text-primary placeholder:text-text-muted resize-none focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all"
            spellCheck={false} />
        </div>

        <div className="space-y-3">
          <h2 className="text-base font-medium text-text-secondary">Live Preview</h2>
          {showSource ? (
            <pre className="w-full h-[400px] p-4 rounded-xl bg-bg-tertiary border border-border text-xs font-mono text-text-primary overflow-auto whitespace-pre-wrap break-all">
              {sanitizeHtml(srcdoc)}
            </pre>
          ) : (
            <iframe ref={iframeRef} title="HTML Preview" srcDoc={srcdoc}
              className="w-full h-[400px] rounded-xl bg-white border border-border"
              sandbox="allow-scripts" />
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
