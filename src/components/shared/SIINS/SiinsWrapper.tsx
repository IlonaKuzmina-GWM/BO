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
import { Header, Transaction } from "@/types";
import CustomSiinsTable from "./CustomSiinsTable";

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
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);

  const limit = 10;
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
    { key: "country", title: "Reference code", width: "15%" },
    { key: "amount", title: "Amount", width: "10%" },
    { key: "createdAt", title: "Created", width: "10%", centered: true },
    { key: "updatedAt", title: "Updated", width: "10%", centered: true },
  ];

  const fetchTransactions = async (page: number) => {
    const response = await fetch(
      `/api/get-transactions?page=${page}&limit=${limit}`,
    );
    const data = await response.json();

    setTransactions(data.transactions);
    setTotalPages(data.totalPages);
  };

  useEffect(() => {
    fetchTransactions(currentPage);
  }, [currentPage]);

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
          <CustomSiinsTable data={filteredTransactions} columns={columns} />

          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default SiinsWrapper;
