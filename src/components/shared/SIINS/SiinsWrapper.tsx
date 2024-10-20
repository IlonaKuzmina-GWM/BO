"use client";

import React, { useEffect, useReducer, useState } from "react";

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
import { filterReducer, initialFilterState } from "./filterSiinsReducer";

const SiinsWrapper = () => {
  const [state, dispatch] = useReducer(filterReducer, initialFilterState);
  const [siinsTransactions, setSiinsTransactions] = useState<Siin[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState(true);

  const fetchSiinsData = async () => {
    setLoading(true);

    let createdDateRange: [number, number] | boolean = false;
    if (state.selectedDateRange?.from && state.selectedDateRange.to) {
      const adjustedToDate = new Date(state.selectedDateRange.to);
      adjustedToDate.setHours(23, 59, 59, 999);
      createdDateRange = [
        state.selectedDateRange.from.getTime(),
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
          searchInput: state.searchQuery || "",
          createdDateRange,
          updatedDateRange,
          paginationPage: state.currentPage,
          paginationPerPage: state.limit,
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

  console.log(siinsTransactions)

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

        <DashButton name={"export"} type={"filled"} />
      </div>

      <div>
        <CustomSiinsTable data={siinsTransactions} columns={SiinsTableHeader} />

        <div className="relative">
          <DataLimitsSeter defaultValue={siinsTransactions.length} onChange={handleLimitChange} />
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

export default SiinsWrapper;
