"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/utils/utils";

interface IDashIntervalSelectProps {
  value: string;
  label: string;
  onIntervalChange: (selectedValue: string) => void;
}

const DashIntervalSelect = ({
  value,
  label,
  onIntervalChange,
}: IDashIntervalSelectProps) => {
  const [selectedValue, setSelectedValue] = useState<string>(value);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const items = [
    { value: "0", label: "Today" },
    { value: "3", label: "Last 3 days" },
    { value: "7", label: "Last 7 days" },
    { value: "this-month", label: "This Month" },
    { value: "this-year", label: "This Year" },
  ];

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const selectValue = (itemValue: string) => {
    setSelectedValue(itemValue);
    onIntervalChange(itemValue);
    setIsOpen(false);
  };

  const clearSelection = () => {
    setSelectedValue("");
    if (onIntervalChange) {
      onIntervalChange("");
    }
  };

  return (
    <div className="h10 relative w-[130px]" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-full rounded-sm border border-divider bg-white px-2 py-[9px] text-start text-sm text-main"
      >
        {items.find((item) => item.value === selectedValue)?.label || value}

        <ChevronDown
          className={`absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-sm border border-divider bg-white shadow-lg">
          <div className="dash_select-options max-h-60 overflow-y-auto">
            <div
              className="cursor-pointer px-3 py-2 text-sm font-semibold hover:bg-divider"
              onClick={clearSelection}
            >
              {label}
            </div>
            {items.map((item) => (
              <div
                key={item.value}
                onClick={() => selectValue(item.value)}
                className={cn(
                  "cursor-pointer px-3 py-2 transition-all duration-300 hover:bg-divider",
                  selectedValue === item.value &&
                    "bg-accent text-accent-foreground",
                )}
              >
                <span className="text-[14px]">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashIntervalSelect;
