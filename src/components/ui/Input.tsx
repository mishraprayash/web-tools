import * as React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  monospace?: boolean;
}

const Input = React.forwardRef<HTMLTextAreaElement, InputProps>(
  ({ className, label, error, monospace = false, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-text-secondary mb-2">{label}</label>
        )}
        <textarea
          ref={ref}
          className={cn(
            'w-full min-h-[200px] px-4 py-3 rounded-lg bg-bg-tertiary border border-border',
            'text-text-primary placeholder:text-text-muted',
            'focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30',
            'transition-all duration-200 resize-none',
            monospace && 'font-mono text-sm',
            error && 'border-error focus:border-error focus:ring-error/30',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1.5 text-sm text-error">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input, type InputProps };