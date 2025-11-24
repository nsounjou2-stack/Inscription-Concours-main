import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Check, ChevronDown } from "lucide-react";

export interface SimpleSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  placeholder?: string;
  error?: boolean;
  touched?: boolean;
}

const SimpleSelect = forwardRef<HTMLSelectElement, SimpleSelectProps>(
  ({ className, placeholder, error, touched, children, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (props.onChange) {
        props.onChange(e);
      }
    };

    return (
      <div className="relative">
        <select
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none",
            error && touched ? "border-red-500" : "border-input",
            touched && !error && "border-green-500",
            className
          )}
          ref={ref}
          onChange={handleChange}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {children}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <ChevronDown className="h-4 w-4 opacity-50" />
        </div>
      </div>
    );
  }
);

SimpleSelect.displayName = "SimpleSelect";

export { SimpleSelect };