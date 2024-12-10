"use client";

import React, { useState, useEffect, useRef } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/utils/utils";
import Search from "./Search";
import useOutsideClick from "@/hooks/useOutsideClick";

interface IItem {
  value: number;
  label: string;
}

interface ITableRowSelect {
  value: number;
  label: string;
  items: IItem[];
  onSelectNumberHandler?: (selectedValue: number) => void;
  onSelectStringHandler?: (selectedValue: string) => void;
}

const DropdownWithSearch = ({
  value,
  label,
  items,
  onSelectNumberHandler,
  onSelectStringHandler,
}: ITableRowSelect) => {
  const [selectedValue, setSelectedValue] = useState<string | number>(value);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useOutsideClick(dropdownRef, buttonRef, () => setIsOpen(false));

  useEffect(() => {
    if (isOpen && buttonRef.current && dropdownRef.current) {
      dropdownRef.current.style.width = `${buttonRef.current.offsetWidth}px`;
    }
  }, [isOpen]);

  const selectValue = (value: number | string) => {
    setSelectedValue(value);
    setSearchTerm("");
    setIsOpen(false);

    const selectedItem = items.find((item) => item.value === value);

    if (onSelectNumberHandler && typeof value === "number") {
      onSelectNumberHandler(value);
    } else if (onSelectStringHandler && selectedItem) {
      onSelectStringHandler(selectedItem.label);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const filteredItems = items.filter((item) =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="relative w-full">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="shadowed relative w-full rounded-sm border border-divider p-2 text-start text-sm text-main"
      >
        {items.find((item) => item.value === selectedValue)?.label || label}
        <ChevronDown
          className={`${isOpen ? "rotate-180" : ""} absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2`}
        />
      </button>
      {isOpen && (
        <div
          className="absolute z-50 mt-1 rounded-sm border border-divider bg-white shadow-lg"
          ref={dropdownRef}
        >
          <Search placeholder="Search" onSearch={handleSearch} />
          <div className="dash_select-options max-h-60 overflow-y-auto">
            {filteredItems.map((item) => (
              <div
                key={item.value}
                onClick={() => selectValue(item.value)}
                className={cn(
                  "cursor-pointer px-3 py-2 transition-all duration-300 hover:bg-divider",
                  selectedValue === item.value && "text-blue600",
                )}
              >
                <div className="flex items-center">
                  {selectedValue === item.value && (
                    <Check className="h-4 w-4 text-blue600" />
                  )}
                  <span className="ml-2">{item.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownWithSearch;
