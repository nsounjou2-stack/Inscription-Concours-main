import React, { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Controller } from "react-hook-form";
import { SelectErrorBoundary } from "@/components/ui/select-error-boundary";

interface ControlledSelectProps {
  control: any;
  name: string;
  placeholder?: string;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export const ControlledSelect: React.FC<ControlledSelectProps> = ({
  control,
  name,
  placeholder,
  children,
  disabled = false,
  className = "",
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);

    return () => {
      clearTimeout(timer);
      setMounted(false);
    };
  }, []);

  const selectContent = (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Select
          value={field.value || ""}
          onValueChange={field.onChange}
          disabled={disabled}
        >
          <SelectTrigger className={className}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {children}
          </SelectContent>
        </Select>
      )}
    />
  );

  return (
    <SelectErrorBoundary>
      {mounted ? selectContent : (
        <SelectTrigger className={className} disabled={disabled}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
      )}
    </SelectErrorBoundary>
  );
};