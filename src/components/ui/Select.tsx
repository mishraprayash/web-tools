import * as React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-text-secondary mb-2">{label}</label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={cn(
              'w-full h-10 px-4 pr-10 rounded-lg bg-bg-tertiary border border-border',
              'text-text-primary appearance-none cursor-pointer',
              'focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30',
              'transition-all duration-200',
              className
            )}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
        </div>
      </div>
    );
  }
);
Select.displayName = 'Select';

export { Select, type SelectProps };