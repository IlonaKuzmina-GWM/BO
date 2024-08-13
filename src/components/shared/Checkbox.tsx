"use client";

import React from "react";
import { Check } from "lucide-react";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
  disabled?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange, className, disabled }) => {
  return (
    <label className={`relative inline-flex items-center ${className}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
        disabled={disabled}
      />
      <div
        className={`h-4 w-4 flex items-center justify-center rounded-sm border border-primary transition-colors ${
          checked ? "bg-primary text-white" : "bg-white"
        } ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
      >
        {checked && <Check className="h-3 w-3" />}
      </div>
    </label>
  );
};

export default Checkbox;
