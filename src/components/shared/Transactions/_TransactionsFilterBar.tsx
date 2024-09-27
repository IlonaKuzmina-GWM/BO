"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import DashButton from "../DashButton";
import Search from "../Search";
import StatusFilteringBadge from "../StatusFilteringBadge";
import DashSelect from "../DashSelect";
import DatePickerWithRange from "../DatePickerWithRange";
import { DateRange } from "react-day-picker";

const TransactionsFilterBar = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  // const router = useRouter();
  // const pathname = usePathname();
  // const searchParams = useSearchParams();
  const [selectedInterval, setSelectedInterval] = useState("this-year");
  const [selectedDateRange, setSelectedDateRange] = useState<
    DateRange | undefined
  >(undefined);

  const items = [
    { value: "apple", label: "Apple" },
    { value: "banana", label: "Banana" },
    { value: "blueberry", label: "Blueberry" },
    { value: "grapes", label: "Grapes" },
    { value: "pineapple", label: "Pineapple" },
  ];

  // const handleSearch = (term: string) => {
  // Update the search term in the URL query parameters
  //   const params = new URLSearchParams(searchParams.toString());
  //   if (term) {
  //     params.set("query", term);
  //   } else {
  //     params.delete("query");
  //   }
  //   router.replace(`${pathname}?${params.toString()}`);
  // };

  // const handleDateRangeChange = (range: DateRange | undefined) => {
  //   setSelectedDateRange(range);
  //   setSelectedInterval("");
  // };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-row justify-between">
        {/* <div className="flex flex-row gap-5"> */}
        {/* <Search
            placeholder="Enter name, email, provider"
            aditionalClass="max-w-[302px]"
            onSearch={handleSearch}
          />
          <DatePickerWithRange onDateChange={handleDateRangeChange} />
          <DashSelect
            value={"Select Merchants"}
            label={"All Merchants"}
            items={items}
            searchInput
            searchContext="merchant"
          />
          <DashSelect
            value={"Select Providers"}
            label={"All Providers"}
            items={items}
            searchInput={false}
            searchContext="provider"
          />
        </div> */}

        <DashButton name={"export"} type={"filled"} />
      </div>
    </div>
  );
};

export default TransactionsFilterBar;
