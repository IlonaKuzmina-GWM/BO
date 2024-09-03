"use client";

import React, { useState, useEffect, useRef } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import Search from "../shared/Search";

interface IItem {
  value: string;
  label: string;
}

interface ITableRowSelect {
  value: string;
  label: string;
  items: IItem[];
  searchInput: boolean;
  onSelectHandler?: (selectedValue: string) => void;
}

const TableRowSelect = ({
  value,
  label,
  items,
  searchInput,
  onSelectHandler,
}: ITableRowSelect) => {
  const [selectedValue, setSelectedValue] = useState<string>(value);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

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
    setIsOpen(false);

    if (onSelectHandler) {
      onSelectHandler(itemValue);
    }
  };

  const filteredItems = items.filter((item) =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  return (
    <div className="w-[100px] lg:w-[180px]" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-full rounded-sm border border-divider bg-white p-2 text-start text-sm text-main"
      >
        {selectedValue
          ? items.find((item) => item.value === selectedValue)?.label
          : label}

        {isOpen ? (
          <ChevronDown className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 rotate-180" />
        ) : (
          <ChevronDown className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2" />
        )}
      </button>
      {isOpen && (
        <div className="absolute z-50 mt-1 rounded-sm border border-divider bg-white shadow-lg w-[100px] lg:w-[180px]">
          {searchInput && (
            <Search placeholder="Search" onSearch={handleSearch} />
          )}
          <div className="max-h-60 overflow-y-auto">
            {filteredItems.map((item) => (
              <div
                key={item.value}
                onClick={() => selectValue(item.value)}
                className={cn(
                  "cursor-pointer px-3 py-2 transition-all duration-300 hover:bg-divider",
                  selectedValue === item.value &&
                    "bg-accent text-accent-foreground"
                )}
              >
                <div className="flex items-center">
                  {selectedValue === item.value && (
                    <Check className="text-accent-foreground h-4 w-4" />
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