"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import Search from "./Search";

interface IItem {
  value: string;
  label: string;
}

interface ICustomMultiSelect {
  value: string;
  label: string;
  items: IItem[];
  searchInput: boolean;
  searchContext: string;
  isMulti?: boolean;
  onSelectHandler?: (selectedValues: string[]) => void;
}

const CustomMultiSelect = ({
  value,
  label,
  items,
  searchInput,
  searchContext,
  isMulti = true,
  onSelectHandler,
}: ICustomMultiSelect) => {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  // const searchParams = useSearchParams();
  // const router = useRouter();
  // const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // useEffect(() => {
  //   const params = new URLSearchParams(searchParams);
  //   const initialSelected = params.get(searchContext);
  //   if (initialSelected) {
  //     setSelectedValues(initialSelected.split(","));
  //   }
  // }, [searchContext, searchParams]);

  useEffect(() => {
    // setSelectedValues([]);
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

  const toggleValue = (itemValue: string) => {
    let newSelectedValues: string[];
    if (isMulti) {
      newSelectedValues = selectedValues.includes(itemValue)
        ? selectedValues.filter((item) => item !== itemValue)
        : [...selectedValues, itemValue];
    } else {
      newSelectedValues = selectedValues.includes(itemValue) ? [] : [itemValue];
      setIsOpen(false); // Close the menu after selecting a value in single-select mode
    }
    setSelectedValues(newSelectedValues);

    if (onSelectHandler) {
      onSelectHandler(newSelectedValues); // Call the callback with the new selected values
    }

    // const params = new URLSearchParams(searchParams.toString());
    // if (newSelectedValues.length > 0) {
    //   params.set(searchContext, newSelectedValues.join(","));
    // } else {
    //   params.delete(searchContext);
    // }
    // router.replace(`${pathname}?${params.toString()}`);
  };

  // const clearSelection = () => {
  //   setSelectedValues([]);
  //   const params = new URLSearchParams(searchParams.toString());
  //   params.delete(searchContext);
  //   router.replace(`${pathname}?${params.toString()}`);
  // };

  const clearSelection = () => {
    setSelectedValues([]);
    if (onSelectHandler) {
      onSelectHandler([]);
    }
  };

  const filteredItems = items.filter((item) =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  return (
    <div className="relative w-[180px]" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-full rounded-sm border border-divider bg-white p-2 text-start text-sm text-main"
      >
        {selectedValues.length === 0
          ? value
          : selectedValues
              .map((val) => items.find((item) => item.value === val)?.label)
              .join(", ")}

        {isOpen ? (
          <ChevronDown className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 rotate-180" />
        ) : (
          <ChevronDown className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2" />
        )}
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-sm border border-divider bg-white shadow-lg">
          {searchInput && (
            <Search placeholder="Search" onSearch={handleSearch} />
          )}
          <div className="dash_select-options max-h-60 overflow-y-auto">
            <div
              className="cursor-pointer px-3 py-2 text-sm font-semibold hover:bg-divider"
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
                  selectedValues.includes(item.value) &&
                    "bg-accent text-accent-foreground",
                )}
              >
                <div className="flex items-center">
                  {selectedValues.includes(item.value) && (
                    <Check className="text-accent-foreground h-4 w-4" />
                  )}
                  <span className="ml-2 text-[14px]">{item.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomMultiSelect;
