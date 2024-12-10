"use client";

import React, { useState, useEffect, useRef } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/utils/utils";
import Search from "./Search";
import useOutsideClick from "@/hooks/useOutsideClick";

interface IItem {
  value: number;
  label: string;
  name?: string;
}

interface ITableRowSelect {
  value: string | number;
  label: string;
  items: IItem[];
  searchInput: boolean;
  onSelectHandler?: (selectedValue: number) => void;
  onSelectStringHandler?: (selectedValue: string) => void;
}

const TableRowSelect = ({
  value,
  label,
  items,
  searchInput,
  onSelectHandler,
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

    if (onSelectHandler && typeof value === "number") {
      onSelectHandler(value);
    } else if (onSelectStringHandler && typeof value === "string") {
      onSelectStringHandler(value);
    }
  };

  const filteredItems = items.filter((item) =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  return (
    <div className="relative w-full">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="shadowed relative w-full rounded-sm border border-divider p-2 text-start text-sm text-main"
      >
        {selectedValue
          ? items.find((item) => item.label === selectedValue)?.label ||
            "No data"
          : label}

        {isOpen ? (
          <ChevronDown className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 rotate-180" />
        ) : (
          <ChevronDown className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2" />
        )}
      </button>
      {isOpen && (
        <div
          className="absolute z-50 mt-1 rounded-sm border border-divider bg-white shadow-lg"
          ref={dropdownRef}
        >
          {searchInput && (
            <Search placeholder="Search" onSearch={handleSearch} />
          )}
          <div className="dash_select-options max-h-60 overflow-y-auto">
            {filteredItems.map((item) => (
              <div
                key={item.value}
                onClick={() => selectValue(item.label)}
                className={cn(
                  "cursor-pointer px-3 py-2 transition-all duration-300 hover:bg-divider",
                  selectedValue === item.label && "text-blue600",
                )}
              >
                <div className="flex items-center">
                  {selectedValue === item.label && (
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

export default TableRowSelect;
