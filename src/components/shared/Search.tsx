"use client";

import React from "react";
import { useDebouncedCallback } from "use-debounce";
import Image from "next/image";

interface ISearch {
  aditionalClass?: string;
  placeholder: string;
  onSearch: (term: string) => void;
}

export default function Search({ placeholder, aditionalClass, onSearch }: ISearch) {
  const handleSearch = useDebouncedCallback((term: string) => {
    onSearch(term);
  }, 300);

  return (
    <div className={`relative flex flex-1 flex-shrink-0 ${aditionalClass}`}>
      <input
        className="peer block w-full rounded-sm border border-divider px-3 py-[10px] pl-[38px] text-sm outline-2 placeholder:text-secondary"
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
      />
      <Image
        src={"/icons/search.svg"}
        alt={"Search icon"}
        width={18}
        height={18}
        className="absolute left-3 top-1/2 h-[15px] w-[15px] -translate-y-1/2"
      />
    </div>
  );
}
