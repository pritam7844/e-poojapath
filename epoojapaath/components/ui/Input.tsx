import { type InputHTMLAttributes, type TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

interface SelectProps {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
  required?: boolean;
  name?: string;
  defaultValue?: string;
  className?: string;
  containerClassName?: string;
}

const baseInput = "w-full border border-border bg-card-bg rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground/60 font-body text-sm focus:outline-none focus:ring-2 focus:ring-saffron focus:border-transparent transition-all disabled:opacity-60";

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-foreground mb-1.5">{label}{props.required && <span className="text-lotus-pink ml-1">*</span>}</label>}
      <input ref={ref} className={cn(baseInput, error && "border-lotus-pink focus:ring-lotus-pink", className)} {...props} />
      {error && <p className="mt-1 text-xs text-lotus-pink">{error}</p>}
    </div>
  ),
);
Input.displayName = "Input";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, ...props }, ref) => (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-foreground mb-1.5">{label}{props.required && <span className="text-lotus-pink ml-1">*</span>}</label>}
      <textarea ref={ref} className={cn(baseInput, "resize-none", error && "border-lotus-pink", className)} {...props} />
      {error && <p className="mt-1 text-xs text-lotus-pink">{error}</p>}
    </div>
  ),
);
Textarea.displayName = "Textarea";

export function Select({ label, error, options, placeholder, className, containerClassName, ...props }: SelectProps) {
  return (
    <div className={containerClassName ? containerClassName : "w-full"}>
      {label && <label className="block text-sm font-medium text-foreground mb-1.5">{label}{props.required && <span className="text-lotus-pink ml-1">*</span>}</label>}
      <select className={cn(baseInput, error && "border-lotus-pink", className)} {...props}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(({ value, label: l }) => <option key={value} value={value}>{l}</option>)}
      </select>
      {error && <p className="mt-1 text-xs text-lotus-pink">{error}</p>}
    </div>
  );
}
