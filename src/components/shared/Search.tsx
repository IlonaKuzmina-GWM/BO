"use client";

import React, { useCallback, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import Image from "next/image";

interface ISearch {
  aditionalClass?: string;
  placeholder: string;
  onSearch: (term: string) => void;
}

const Search: React.FC<ISearch> = ({
  placeholder,
  aditionalClass,
  onSearch,
}) => {
  const [inputValue, setInputValue] = useState("");

  const debouncedOnSearch = useDebouncedCallback((term: string) => {
    onSearch(term);
  }, 500);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setInputValue(term);
    debouncedOnSearch(term);
  };

  return (
    <div
      className={`relative flex flex-1 flex-shrink-0 ${aditionalClass} h-10`}
    >
      <input
        className="peer block w-full rounded-sm border border-divider px-3 py-[10px] pl-[38px] text-sm outline-2 placeholder:text-secondary"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleChange}
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

export default Search;
