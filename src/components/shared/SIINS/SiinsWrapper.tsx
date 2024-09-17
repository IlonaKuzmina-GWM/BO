"use client";

import React, { useEffect, useState } from "react";

import TransactionsListWrapper from "../Transactions/TransactionsListWrapper";
import Search from "../Search";
import DatePickerWithRange from "../DatePickerWithRange";
import DashButton from "../DashButton";
// import { usePathname, useSearchParams } from "next/navigation";
// import { useRouter } from "next/router";
import { DateRange } from "react-day-picker";
import PaginationComponent from "../PaginationComponent ";
import { Header, Siin, Transaction } from "@/types";
import CustomSiinsTable from "./CustomSiinsTable";
import DataLimitsSeter from "../DataLimitsSeter";
import { LoadingSpiner } from "../LoadingUI/LoadingSpiner";

const SiinsWrapper = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  // const router = useRouter();
  // const pathname = usePathname();
  // const searchParams = useSearchParams();
  const [selectedInterval, setSelectedInterval] = useState("this-year");
  const [selectedDateRange, setSelectedDateRange] = useState<
    DateRange | undefined
  >(undefined);
  const [siinsTransactions, setSiinsTransactions] = useState<Siin[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);
  const [loading, setLoading] = useState(true);

  const [limit, setLimit] = useState<number>(10);

  const items = [
    { value: "apple", label: "Apple" },
    { value: "banana", label: "Banana" },
    { value: "blueberry", label: "Blueberry" },
    { value: "grapes", label: "Grapes" },
    { value: "pineapple", label: "Pineapple" },
  ];
  const columns: Header[] = [
    { key: "id", title: "ID", width: "7%", centered: true },
    { key: "iban", title: "IBAN", width: "15%" },
    { key: "name", title: "Name", width: "15%" },
    { key: "country", title: "Country", width: "15%" },
    { key: "refcode", title: "Reference code", width: "15%" },
    { key: "amount", title: "Amount", width: "10%" },
    { key: "createdAt", title: "Created", width: "10%", centered: true },
    { key: "updatedAt", title: "Updated", width: "10%", centered: true },
  ];

  useEffect(() => {
    fetchCountriesData();
  }, [selectedInterval, selectedDateRange]);

  const fetchCountriesData = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedDateRange && selectedDateRange.from && selectedDateRange.to) {
        params.append("from", selectedDateRange.from.toISOString());
        params.append("to", selectedDateRange.to.toISOString());
      } else if (selectedInterval) {
        params.append("interval", selectedInterval);
      }

      const response = await fetch(`/api/get-siin?${params.toString()}`, {
        method: "GET",
      });
      const { siin }: { siin: Siin[] } = await response.json();
      setSiinsTransactions(siin);
      setLoading(false);
      console.log("sins", siin)
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // const fetchTransactions = async (page: number) => {
  //   const response = await fetch(
  //     `/api/get-transactions?page=${page}&limit=${limit}`,
  //   );
  //   const data = await response.json();

  //   setTransactions(data.transactions);
  //   setTotalPages(data.totalPages);
  //   setLoading(false);
  // };

  // useEffect(() => {
  //   fetchTransactions(currentPage);
  // }, [currentPage]);

  const handleSearch = (term: string) => {
    // Update the search term in the URL query parameters
    // const params = new URLSearchParams(searchParams.toString());
    // if (term) {
    //   params.set("query", term);
    // } else {
    //   params.delete("query");
    // }
    // router.replace(`${pathname}?${params.toString()}`);
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setSelectedDateRange(range);
    setSelectedInterval("");
  };

  const handleLimitChange = (limit: number) => {
    setLimit(limit);
  };

  if (loading) {
    return (
      <div className="flex w-full items-center justify-center">
        <LoadingSpiner />
      </div>
    );
  }

  return (
    <div className="">
      <div className="flex flex-col gap-6">
        <div className="flex flex-row justify-between">
          <div className="flex flex-row gap-5">
            <Search
              placeholder="Enter name, email, provider"
              aditionalClass="max-w-[302px]"
              onSearch={handleSearch}
            />
            <DatePickerWithRange onDateChange={handleDateRangeChange} />
          </div>

          <DashButton name={"export"} type={"filled"} />
        </div>

        <div>
          <CustomSiinsTable data={siinsTransactions} columns={columns} />

          <div className="relative">
            <DataLimitsSeter onChange={handleLimitChange} />
            <PaginationComponent
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiinsWrapper;
