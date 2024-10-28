import React from "react";
import Image from "next/image";

interface ISearch {
  aditionalClass?: string;
  placeholder: string;
  onSearch: (term: string) => void;
  searchValue?: string;
}

const Search: React.FC<ISearch> = ({
  placeholder,
  aditionalClass,
  onSearch,
  searchValue,
}) => {
  return (
    <div
      className={`relative flex flex-1 flex-shrink-0 ${aditionalClass} h-10`}
    >
      <input
        className="peer block w-full rounded-sm border border-divider px-3 py-[10px] pl-[38px] text-sm outline-2 placeholder:text-secondary"
        placeholder={placeholder}
        value={searchValue}
        onChange={(e) => onSearch(e.target.value)}
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
};

export default Search;
