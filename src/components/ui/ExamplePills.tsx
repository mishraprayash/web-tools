import * as React from 'react';
import { cn } from '@/lib/utils';

interface ExamplePillsProps {
  examples: { label: string }[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

export { ExamplePills, type ExamplePillsProps };

function ExamplePills({ examples, activeIndex, onSelect }: ExamplePillsProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs text-text-muted">Examples:</span>
      {examples.map((ex, i) => (
        <button key={ex.label} onClick={() => onSelect(i)}
          className={cn('px-3 py-1 rounded-full text-xs font-medium border transition-all',
            activeIndex === i
              ? 'bg-accent text-bg-primary border-accent'
              : 'bg-bg-tertiary text-text-secondary border-border hover:border-border-hover hover:text-text-primary'
          )}>
          {ex.label}
        </button>
      ))}
    </div>
  );
}
