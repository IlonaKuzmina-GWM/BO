"use client";

import { cn } from "@/utils/utils";
import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Search from "./Search";
import useOutsideClick from "@/hooks/useOutsideClick";

interface IItem {
  value: number;
  label: string;
}

interface IDashSelectValueNumber {
  value: number[];
  label: string;
  items: IItem[];
  isMulti?: boolean;
  onSelectHandler: (selectedValues: number[]) => void;
  disabled?: boolean;
  width?: string;
  isInvalid?: boolean;
}

const DashSelectValueNumber = ({
  value = [],
  label,
  items,
  isMulti = true,
  onSelectHandler,
  disabled,
  width = "200px",
  isInvalid = false,
}: IDashSelectValueNumber) => {
  const [selectedValues, setSelectedValues] = useState<number[]>(value);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useOutsideClick(dropdownRef, buttonRef, () => setIsOpen(false));

  const toggleValue = (itemValue: number) => {
    let newSelectedValues: number[];
    if (isMulti) {
      newSelectedValues = selectedValues.includes(itemValue)
        ? selectedValues.filter((item) => item !== itemValue)
        : [...selectedValues, itemValue];
    } else {
      newSelectedValues = selectedValues.includes(itemValue) ? [] : [itemValue];
      setIsOpen(false);
    }
    setSelectedValues(newSelectedValues);

    if (onSelectHandler) {
      onSelectHandler(newSelectedValues);
    }
  };

  const clearSelection = () => {
    setSelectedValues([]);
    setIsOpen(false);
    if (onSelectHandler) {
      onSelectHandler([]);
    }
  };

  const filteredItems = items.filter((item) =>
    item.label?.toLowerCase().includes(searchTerm?.toLowerCase()),
  );

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  return (
    <div className={`relative h-10 w-[${width}] `}>
      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`relative min-h-10 w-full rounded-sm border bg-white p-2 pe-5 text-start text-sm text-main ${
          disabled ? "cursor-not-allowed text-secondary" : ""
        } ${isInvalid ? "border-error" : "border-divider"}`}
      >
        <span
          className={`block ${
            !isOpen ? "overflow-hidden text-ellipsis whitespace-nowrap" : ""
          }`}
        >
          {selectedValues.length > 0
            ? selectedValues
                .map((val) => items.find((item) => item.value === val)?.label)
                .filter(Boolean)
                .join(", ")
            : label}
        </span>

        <ChevronDown
          className={`absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isInvalid && (
        <div className="text-[12px] text-error">This field is required.</div>
      )}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-10 mt-1 w-full rounded-sm border border-divider bg-white shadow-lg"
        >
          <Search placeholder="Search" onSearch={handleSearch} />

          <div className="dash_select-options max-h-60 overflow-y-auto">
            <div
              className="cursor-pointer px-3 py-2 text-start text-sm font-semibold hover:bg-divider"
              onClick={clearSelection}
            >
              {label}
            </div>
            {filteredItems.map((item) => (
              <div
                key={item.value}
                onClick={() => toggleValue(item.value)}
                className={cn(
                  "cursor-pointer px-3 py-2 transition-all duration-300 hover:bg-divider",
                  selectedValues.includes(item.value) && "text-blue600",
                )}
              >
                <div className="flex items-center">
                  {selectedValues.includes(item.value) && (
                    <Check className="h-4 w-4 text-blue600" />
                  )}
                  <span className="ml-2 text-start text-[14px]">
                    {item.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashSelectValueNumber;
