'use client';

import * as React from 'react';
import { Copy, Check } from 'lucide-react';
import { Button, type ButtonProps } from '@/components/ui/Button';
import { toast } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';

interface CopyButtonProps extends Omit<ButtonProps, 'icon' | 'onClick'> {
  value: string;
  label?: string;
}

function CopyButton({ value, label, className, children, ...props }: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false);

  const handleClick = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast({ type: 'success', message: 'Copied!' });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ type: 'error', message: 'Failed to copy' });
    }
  }, [value]);

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(className, copied && 'text-success')}
      onClick={handleClick}
      icon={copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {...props}
    >
      {children ?? (copied ? 'Copied' : label)}
    </Button>
  );
}

CopyButton.displayName = 'CopyButton';

export { CopyButton };
