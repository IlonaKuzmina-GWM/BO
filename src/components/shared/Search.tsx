"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import Image from "next/image";

interface ISearch {
  aditionalClass?: string;
  placeholder: string;
}

export default function Search({ placeholder, aditionalClass }: ISearch) {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const handleSearch = useDebouncedCallback((term: string) => {
    console.log(`Searching... ${term}`);

    const params = new URLSearchParams(searchParams);

    params.set("page", "1");

    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className={`relative flex flex-1 flex-shrink-0 ${aditionalClass}`}>
      <input
        className="peer block w-full rounded-sm border border-divider px-3 py-[10px] pl-[38px] text-sm outline-2 placeholder:text-secondary"
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get("query")?.toString()}
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
