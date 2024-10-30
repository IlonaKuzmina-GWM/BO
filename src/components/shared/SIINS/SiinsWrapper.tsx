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
import DashIntervalSelect from "../DashIntervalSelect";
import { getStartDateForInterval } from "@/helpers/getStartDateForInterval";

const SiinsWrapper = () => {
  const [siinsTransactions, setSiinsTransactions] = useState<Siin[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState(true);

  const [inputSearchQueryValue, setInputSearchQueryValue] =
    useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [limit, setLimit] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedInterval, setSelectedInterval] = useState("");
  const [selectedDateRange, setSelectedDateRange] = useState<
    DateRange | undefined
  >(undefined);

  const fetchSiinsData = async () => {
    setLoading(true);

    let createdDateRange: [number, number] | boolean = false;
    if (selectedDateRange?.from && selectedDateRange.to) {
      const adjustedToDate = new Date(selectedDateRange.to);
      adjustedToDate.setHours(23, 59, 59, 999);
      createdDateRange = [
        selectedDateRange.from.getTime(),
        adjustedToDate.getTime(),
      ];
    }

    const updatedDateRange: [number, number] | boolean = false;

    try {
      const response = await fetch("/api/post-siin-all", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          searchInput: searchQuery || "",
          createdDateRange,
          updatedDateRange,
          paginationPage: currentPage,
          paginationPerPage: limit,
        }),
      });

      if (response.ok) {
        const res = await response.json();

        setSiinsTransactions(res.response.siins);
        setTotalPages(res.response.totalPages);
      } else {
        console.log("Siins response failed");
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSiinsData();
  }, [searchQuery, limit, currentPage, selectedDateRange]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(inputSearchQueryValue);
    }, 1000); 

    return () => clearTimeout(handler);
  }, [inputSearchQueryValue]);

  const handleSearchChange = (value: string) => {
    setInputSearchQueryValue(value);
  };

  const handleIntervalChange = (interval: string) => {
    setCurrentPage(1);
    setSelectedInterval(interval);

    const startDate = getStartDateForInterval(interval);
    const now = new Date();

    if (startDate) {
      const dateRange: DateRange = { from: startDate, to: now };
      setSelectedDateRange(dateRange);
    } else {
      setSelectedDateRange(undefined);
    }
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setSelectedDateRange(range);
    setSelectedInterval("");
  };

  const handleLimitChange = (limit: number) => {
    setLimit(limit);
  };

  console.log(siinsTransactions);

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
            onSearch={handleSearchChange}
            searchValue={inputSearchQueryValue}
          />

          <div className="flex flex-col md:flex-row">
            <DashIntervalSelect
              value={selectedInterval || "Select Interval"}
              label="No Interval"
              onIntervalChange={handleIntervalChange}
            />
            <DatePickerWithRange
              initialDate={selectedDateRange}
              onDateChange={handleDateRangeChange}
            />
          </div>
        </div>

        <DashButton name={"export"} type={"filled"} />
      </div>

      <div>
        <CustomSiinsTable data={siinsTransactions} columns={SiinsTableHeader} />

        <div className="relative">
          <DataLimitsSeter
            defaultValue={siinsTransactions.length}
            onChange={handleLimitChange}
          />
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
