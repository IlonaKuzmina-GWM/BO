import React from "react";
import Image from "next/image";

interface ISearch {
  aditionalClass?: string;
  placeholder: string;
  onSearch: (term: string) => void;
  searchValue?: string;
  searchIcon?:boolean;
}

const Search: React.FC<ISearch> = ({
  placeholder,
  aditionalClass,
  onSearch,
  searchValue,
  searchIcon
}) => {
  return (
    <div
      className={`relative flex flex-1 flex-shrink-0 ${aditionalClass} h-10`}
    >
      <input
        className={`peer block w-full rounded-sm border border-divider px-3 py-[10px]  text-sm outline-2 placeholder:text-secondary ${searchIcon ? "pl-[38px]" :""}`}
        placeholder={placeholder}
        value={searchValue}
        onChange={(e) => onSearch(e.target.value)}
      />
      {searchIcon ?  <Image
        src={"/icons/search.svg"}
        alt={"Search icon"}
        width={18}
        height={18}
        className="absolute left-3 top-1/2 h-[15px] w-[15px] -translate-y-1/2"
      /> : null}
    </div>
  );
};

export default Search;
