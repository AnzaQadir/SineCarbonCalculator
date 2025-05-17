import React from 'react';
import { cn } from '@/lib/utils';

interface YesNoToggleProps {
  value: boolean;
  onChange: (value: boolean) => void;
  className?: string;
}

export const YesNoToggle: React.FC<YesNoToggleProps> = ({ value, onChange, className }) => (
  <div className={cn("flex items-center justify-center w-full space-x-4 mt-4", className)}>
    <label className="inline-flex items-center">
      <input
        type="radio"
        className="peer sr-only"
        checked={!value}
        onChange={() => onChange(false)}
      />
      <div className={cn(
        "w-32 h-12 rounded-2xl bg-secondary/50 text-muted-foreground flex items-center justify-center text-sm font-medium transition-all cursor-pointer hover:bg-secondary/80",
        !value && "bg-primary/10 text-primary border-2 border-primary/50"
      )}>
        No
      </div>
    </label>
    <label className="inline-flex items-center">
      <input
        type="radio"
        className="peer sr-only"
        checked={value}
        onChange={() => onChange(true)}
      />
      <div className={cn(
        "w-32 h-12 rounded-2xl bg-secondary/50 text-muted-foreground flex items-center justify-center text-sm font-medium transition-all cursor-pointer hover:bg-secondary/80",
        value && "bg-primary/10 text-primary border-2 border-primary/50"
      )}>
        Yes
      </div>
    </label>
  </div>
); 