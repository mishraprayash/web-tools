'use client';

import * as React from 'react';
import { Copy, RotateCcw, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ToolLayout } from '@/components/tool/ToolLayout';
import { decodeJWT, getJWTStatus, JWTPayload } from '@/tools/jwt/utils';
import { toast } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';

const SAMPLE_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
  'eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFsaWNlIiwiaWF0IjoxNTE2MjM5MDIyfQ.' +
  'SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

const ADMIN_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
  'eyJzdWIiOiI5ODc2NTQzMjEwIiwibmFtZSI6IkJvYiBBZG1pbiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxNTE2MjQyNjIyfQ.' +
  'abc123';

const examples = [
  { label: 'User token (valid)', value: SAMPLE_JWT },
  { label: 'Admin token (expired)', value: ADMIN_JWT },
];

export default function Page() {
  const [input, setInput] = React.useState(SAMPLE_JWT);
  const [decoded, setDecoded] = React.useState<JWTPayload | null>(null);
  const [status, setStatus] = React.useState<'valid' | 'expired' | 'invalid'>('valid');
  const [activeExample, setActiveExample] = React.useState(0);

  React.useEffect(() => {
    if (!input.trim()) { setDecoded(null); return; }
    const result = decodeJWT(input);
    setDecoded(result);
    setStatus(result ? getJWTStatus(input) : 'invalid');
  }, [input]);

  const handleCopy = async (text: string) => { await navigator.clipboard.writeText(text); toast({ type: 'success', message: 'Copied!' }); };
  const handleClear = () => { setInput(''); setDecoded(null); setActiveExample(-1); };

  const applyExample = (i: number) => { setActiveExample(i); setInput(examples[i].value); };

  return (
    <ToolLayout toolId="jwt" name="JWT Decoder" description="Decode and inspect JWT tokens — header, payload and expiry" category="Security">
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
            <h2 className="text-base font-medium text-text-secondary">Token</h2>
            <Button variant="ghost" size="sm" onClick={handleClear} icon={<RotateCcw className="h-4 w-4" />}>Clear</Button>
          </div>
          <Input value={input} onChange={(e) => { setInput(e.target.value); setActiveExample(-1); }} placeholder="Paste JWT token..." />

          {decoded && status === 'valid' && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-success/10 text-success border border-success/30">
              <CheckCircle className="h-5 w-5" /><span className="font-medium">Token Valid</span>
            </div>
          )}
          {decoded && status === 'expired' && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-warning/10 text-warning border border-warning/30">
              <AlertCircle className="h-5 w-5" /><span className="font-medium">Token Expired</span>
            </div>
          )}
          {input.trim() && !decoded && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-error/10 text-error border border-error/30">
              <AlertCircle className="h-5 w-5" /><span className="font-medium">Invalid Token</span>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {decoded ? (
            <>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium text-text-secondary">Header</h3>
                  <Button variant="ghost" size="sm" onClick={() => handleCopy(JSON.stringify(decoded.header, null, 2))} icon={<Copy className="h-4 w-4" />}>Copy</Button>
                </div>
                <pre className="p-4 rounded-lg bg-bg-tertiary text-sm font-mono overflow-auto">{JSON.stringify(decoded.header, null, 2)}</pre>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium text-text-secondary">Payload</h3>
                  <Button variant="ghost" size="sm" onClick={() => handleCopy(JSON.stringify(decoded.payload, null, 2))} icon={<Copy className="h-4 w-4" />}>Copy</Button>
                </div>
                <pre className="p-4 rounded-lg bg-bg-tertiary text-sm font-mono overflow-auto">{JSON.stringify(decoded.payload, null, 2)}</pre>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-48 rounded-lg bg-bg-tertiary text-text-muted text-sm">
              Enter a JWT token to decode
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
