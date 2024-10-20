"use client";

import React, { useEffect, useReducer, useState } from "react";
import { DateRange } from "react-day-picker";
import { Log } from "@/types/logs";
import { LogsTableHeader } from "@/utils/tableHeaders";
import { getStartDateForInterval } from "@/helpers/getStartDateForInterval";

import {
  filterReducer,
  initialFilterState,
} from "./filterReducer";

import CustomLogsTable from "../CustomLogsTable";
import DashIntervalSelect from "../DashIntervalSelect";
import DataLimitsSeter from "../DataLimitsSeter";
import DatePickerWithRange from "../DatePickerWithRange";
import { LoadingSpiner } from "../LoadingUI/LoadingSpiner";
import PaginationComponent from "../PaginationComponent ";
import Search from "../Search";

const LogsWrapper = () => {
  const [state, dispatch] = useReducer(filterReducer, initialFilterState);
  const [logsData, setLogsData] = useState<Log[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState(true);

  const fetchLogsData = async () => {
    setLoading(true);

    let dateRange: number[] = [];
    if (state.selectedDateRange?.from && state.selectedDateRange.to) {
      const adjustedToDate = new Date(state.selectedDateRange.to);
      adjustedToDate.setHours(23, 59, 59, 999);
      dateRange = [
        state.selectedDateRange.from.getTime(),
        adjustedToDate.getTime(),
      ];
    }

    try {
      const response = await fetch("/api/post-events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          search: state.searchQuery,
          dateRange,
          type: [],
          paginationPage: state.currentPage,
          paginationPerPage: state.limit,
        }),
      });

      if (response.ok) {
        const res = await response.json();
        console.log("Event response ok", res);

        setLogsData(res.events || res.paginatedLogs);
        setTotalPages(res.totalPages);
      } else {
        console.log("Event response failed");
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogsData();
  }, [
    state.searchQuery,
    state.selectedDateRange,
    state.limit,
    state.currentPage,
  ]);

  const handleSearch = (term: string) => {
    dispatch({ type: "SET_SEARCH_QUERY", payload: term });
  };

  const handleIntervalChange = (interval: string) => {
    dispatch({ type: "SET_INTERVAL", payload: interval });

    const startDate = getStartDateForInterval(interval);
    const now = new Date();

    if (startDate) {
      const dateRange: DateRange = { from: startDate, to: now };
      dispatch({ type: "SET_DATE_RANGE", payload: dateRange });
    } else {
      dispatch({ type: "SET_DATE_RANGE", payload: undefined });
    }
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    dispatch({ type: "SET_DATE_RANGE", payload: range });
  };

  const handleLimitChange = (limit: number) => {
    dispatch({ type: "SET_LIMIT", payload: limit });
  };

  if (loading) {
    return (
      <div className="flex w-full items-center justify-center">
        <LoadingSpiner />
      </div>
    );
  }

  return (
    <div className="flex max-w-[1440px] flex-col gap-6">
      <div className="flex flex-row justify-between">
        <div className="flex flex-row gap-5">
          <Search
            placeholder="Enter name, email, provider"
            aditionalClass="max-w-[302px]"
            onSearch={handleSearch}
          />

          <div className="flex flex-col md:flex-row">
            <DashIntervalSelect
              value={state.selectedInterval || "Select Interval"}
              label="No Interval"
              onIntervalChange={handleIntervalChange}
            />
            <DatePickerWithRange
              initialDate={state.selectedDateRange}
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
            currentPage={state.currentPage}
            totalPages={totalPages}
            onPageChange={(page) =>
              dispatch({ type: "SET_CURRENT_PAGE", payload: page })
            }
          />
        </div>
      </div>
    </div>
  );
};

export default LogsWrapper;
