'use client';

import * as React from 'react';
import { ExamplePills } from '@/components/ui/ExamplePills';
import { ToolLayout } from '@/components/tool/ToolLayout';
import { CopyButton } from '@/components/ui/CopyButton';
import { sanitizeHtml, wrapHtmlDocument, formatHtml } from '@/tools/html-preview/utils';
import { cn } from '@/lib/utils';

const examples = [
  { label: 'Simple card', value: '<div style="padding:20px;border-radius:12px;background:linear-gradient(135deg,#667eea,#764ba2);color:white;font-family:sans-serif;max-width:300px"><h2>Hello!</h2><p>This is a live preview.</p><button style="padding:8px 16px;border-radius:6px;border:none;background:white;color:#667eea;cursor:pointer">Click me</button></div>' },
  { label: 'Table', value: '<table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;font-family:sans-serif"><tr style="background:#f0f0f0"><th>Name</th><th>Role</th><th>Status</th></tr><tr><td>Alice</td><td>Admin</td><td style="color:green">Active</td></tr><tr><td>Bob</td><td>Editor</td><td style="color:orange">Pending</td></tr></table>' },
  { label: 'Typography', value: '<h1>Heading 1</h1><h2>Heading 2</h2><p style="font-size:16px;line-height:1.6">This is a paragraph with <strong>bold</strong>, <em>italic</em>, and <a href="#">a link</a>. Lorem ipsum dolor sit amet.</p><blockquote style="border-left:4px solid #667eea;padding-left:16px;margin:16px 0;color:#666">A blockquote example for preview.</blockquote><code style="background:#f5f5f5;padding:2px 6px;border-radius:4px">inline code</code>' },
  { label: 'Full document', value: '<!DOCTYPE html><html><head><style>body{font-family:sans-serif;max-width:600px;margin:40px auto;padding:0 20px;line-height:1.6}h1{color:#333}footer{margin-top:40px;padding-top:20px;border-top:1px solid #eee;color:#999;font-size:14px}</style></head><body><h1>Full Document</h1><p>This is a complete HTML document with styles.</p><footer>&copy; 2024 DevTools Pro</footer></body></html>' },
];

function highlightHtml(html: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let key = 0;

  const tagPattern = /(<!--[\s\S]*?-->)|(<!DOCTYPE[^>]*>)|(<\/?[a-zA-Z][\s\S]*?>)|([^<]+)/g;

  const push = (text: string, className?: string) => {
    nodes.push(
      className
        ? <span key={key++} className={className}>{text}</span>
        : <React.Fragment key={key++}>{text}</React.Fragment>,
    );
  };

  let match: RegExpExecArray | null;
  while ((match = tagPattern.exec(html)) !== null) {
    const [, comment, doctype, tag, text] = match;

    if (comment) {
      push(comment, 'text-text-muted italic');
    } else if (doctype) {
      push(doctype, 'text-text-muted');
    } else if (tag) {
      const parts = tag.match(/^(<\/?)([a-zA-Z]\w*)([\s\S]*?)(\/?>)$/);
      if (parts) {
        const [, open, tagName, attrs, close] = parts;
        push(open, 'text-accent');
        push(tagName, 'text-accent font-semibold');
        if (attrs) {
          const attrPattern = /([a-zA-Z][\w-]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'))?/g;
          let attrMatch: RegExpExecArray | null;
          let last = 0;
          while ((attrMatch = attrPattern.exec(attrs)) !== null) {
            if (attrMatch.index > last) push(attrs.slice(last, attrMatch.index));
            push(attrMatch[1], 'text-success');
            if (attrMatch[2] !== undefined) push(`="${attrMatch[2]}"`, 'text-yellow-400');
            else if (attrMatch[3] !== undefined) push(`='${attrMatch[3]}'`, 'text-yellow-400');
            last = attrMatch.index + attrMatch[0].length;
          }
          if (last < attrs.length) push(attrs.slice(last));
        }
        push(close, 'text-accent');
      } else {
        push(tag);
      }
    } else if (text) {
      push(text);
    }
  }

  return nodes;
}

export default function Page() {
  const [input, setInput] = React.useState(examples[0].value);
  const [activeExample, setActiveExample] = React.useState(0);
  const [showSource, setShowSource] = React.useState(false);

  const iframeRef = React.useRef<HTMLIFrameElement>(null);
  const srcdoc = React.useMemo(() => wrapHtmlDocument(input), [input]);

  const handleFormat = () => {
    setInput(formatHtml(input));
  };

  return (
    <ToolLayout name="HTML Preview" description="Write HTML and see it rendered live with an inline preview" category="Formatting">
      <ExamplePills examples={examples} activeIndex={activeExample} onSelect={(i) => { setActiveExample(i); setInput(examples[i].value); }} />

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
        <CopyButton value={input} label="Copy HTML" variant="secondary" className="px-3 py-1.5 text-xs" />
        <button onClick={handleFormat}
          className="px-3 py-1.5 text-xs font-medium rounded-lg border border-border bg-bg-tertiary text-text-secondary hover:border-border-hover hover:text-text-primary transition-all">
          Format
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h2 className="text-base font-medium text-text-secondary">HTML</h2>
          <textarea value={input} onChange={(e) => { setInput(e.target.value); setActiveExample(-1); }}
            onKeyDown={(e) => {
              if (e.key === 'Tab') {
                e.preventDefault();
                const target = e.currentTarget;
                const start = target.selectionStart;
                const end = target.selectionEnd;
                setInput(input.slice(0, start) + '  ' + input.slice(end));
                React.startTransition(() => {
                  setTimeout(() => {
                    target.selectionStart = target.selectionEnd = start + 2;
                  }, 0);
                });
              }
            }}
            placeholder="<h1>Hello World</h1>"
            className="w-full h-[450px] p-4 rounded-xl bg-bg-tertiary border border-border text-sm font-mono text-text-primary placeholder:text-text-muted resize-none focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all"
            spellCheck={false} />
        </div>

        <div className="space-y-3">
          <h2 className="text-base font-medium text-text-secondary">Live Preview</h2>
          {showSource ? (
            <div className="w-full h-[450px] p-4 rounded-xl bg-bg-tertiary border border-border text-xs font-mono text-text-primary overflow-auto whitespace-pre-wrap break-all">
              {highlightHtml(sanitizeHtml(srcdoc))}
            </div>
          ) : (
            <iframe ref={iframeRef} title="HTML Preview" srcDoc={srcdoc}
              className="w-full h-[450px] rounded-xl bg-white border border-border"
              sandbox="allow-scripts" />
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
