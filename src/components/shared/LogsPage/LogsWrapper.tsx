"use client";

import React, { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { Log } from "@/types/logs";
import { LogsTableHeader } from "@/utils/tableHeaders";
import { getStartDateForInterval } from "@/helpers/getStartDateForInterval";

import CustomLogsTable from "./CustomLogsTable";
import DashIntervalSelect from "../DashIntervalSelect";
import DataLimitsSeter from "../DataLimitsSeter";
import DatePickerWithRange from "../DatePickerWithRange";
import { LoadingSpiner } from "../LoadingUISkeletons/LoadingSpiner";
import PaginationComponent from "../PaginationComponent";
import Search from "../Search";

const LogsWrapper = () => {
  const [logsData, setLogsData] = useState<Log[]>([]);
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

  const fetchLogsData = async () => {
    setLoading(true);

    let dateRange: number[] = [];
    if (selectedDateRange?.from && selectedDateRange.to) {
      const adjustedToDate = new Date(selectedDateRange.to);
      adjustedToDate.setHours(23, 59, 59, 999);
      dateRange = [selectedDateRange.from.getTime(), adjustedToDate.getTime()];
    }

    try {
      const response = await fetch("/api/post-events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          search: searchQuery,
          dateRange,
          type: [],
          paginationPage: currentPage,
          paginationPerPage: limit,
        }),
      });

      if (response.ok) {
        const res = await response.json();
        // console.log("Event response ok", res);

        setLogsData(res.events || res.paginatedLogs);
        setTotalPages(res.totalPages);
      } else {
        // console.log("Event response failed");
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogsData();
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
      </div>

      <div>
        <CustomLogsTable columns={LogsTableHeader} data={logsData} />

        <div className="relative">
          <DataLimitsSeter
            defaultValue={logsData.length}
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

export default LogsWrapper;
