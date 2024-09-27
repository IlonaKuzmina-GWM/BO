"use client";

import React, { useEffect, useState } from "react";

import Search from "../Search";
import DatePickerWithRange from "../DatePickerWithRange";
import DashButton from "../DashButton";
import { DateRange } from "react-day-picker";
import PaginationComponent from "../PaginationComponent ";
import { Siin } from "@/types";
import CustomSiinsTable from "./CustomSiinsTable";
import DataLimitsSeter from "../DataLimitsSeter";
import { LoadingSpiner } from "../LoadingUI/LoadingSpiner";
import { SiinsTableHeader } from "@/utils/tableHeaders";
import { IntervalSelect } from "@/components/UI/IntervalSelect";

const SiinsWrapper = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedInterval, setSelectedInterval] = useState("this-year");
  const [selectedDateRange, setSelectedDateRange] = useState<
    DateRange | undefined
  >(undefined);
  const [siinsTransactions, setSiinsTransactions] = useState<Siin[]>([]);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState<number>(10);

  const fetchSiinsData = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedDateRange && selectedDateRange.from && selectedDateRange.to) {
        params.append("from", selectedDateRange.from.toISOString());
        params.append("to", selectedDateRange.to.toISOString());
        params.append("limit", limit.toString());
        params.append("page", currentPage.toString());
      } else if (selectedInterval) {
        params.append("interval", selectedInterval);
        params.append("limit", limit.toString());
        params.append("page", currentPage.toString());
      }

      if (searchQuery) {
        params.append("query", searchQuery);
      }

      const response = await fetch(`/api/get-siin?${params.toString()}`, {
        method: "GET",
      });
      const {
        paginatedSiins,
        totalPages,
      }: { paginatedSiins: Siin[]; totalPages: number } = await response.json();
      setSiinsTransactions(paginatedSiins);
      setLoading(false);
      setTotalPages(totalPages);
      console.log("sins", paginatedSiins);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchSiinsData();
  }, [selectedInterval, selectedDateRange, limit, searchQuery, currentPage]);

  const handleSearch = (term: string) => {
    setSearchQuery(term);
  };

  const handleIntervalChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSelectedInterval(event.target.value);
    setSelectedDateRange(undefined);
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
    <div className="flex flex-col gap-6">
      <div className="flex flex-row justify-between">
        <div className="flex flex-row gap-5">
          <Search
            placeholder="Enter name, email, provider"
            aditionalClass="max-w-[302px]"
            onSearch={handleSearch}
          />

          <div className="flex flex-col md:flex-row">
            <IntervalSelect
              onIntervalChange={handleIntervalChange}
              selectedInterval={selectedInterval}
            />
            <DatePickerWithRange onDateChange={handleDateRangeChange} />
          </div>
        </div>

        <DashButton name={"export"} type={"filled"} />
      </div>

      <div>
        <CustomSiinsTable data={siinsTransactions} columns={SiinsTableHeader} />

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
  );
};

export default SiinsWrapper;
