"use client";

import React, { useEffect, useState } from "react";

import Search from "../Search";
import DatePickerWithRange from "../DatePickerWithRange";
import { DateRange } from "react-day-picker";
import PaginationComponent from "../PaginationComponent";

import CustomSiinsTable from "./CustomSiinsTable";
import DataLimitsSeter from "../DataLimitsSeter";
import { SiinsTableHeader } from "@/constants/tableHeaders";
import DashIntervalSelect from "../DashIntervalSelect";
import { getStartDateForInterval } from "@/helpers/getStartDateForInterval";
import { exportExcelSiins } from "@/utils/export-utils";
import ExportButton from "../ExportButton";
import { useStore } from "@/stores/StoreProvider";
import { observer } from "mobx-react-lite";
import { Siin } from "@/types/siin";

const SiinsWrapper = observer(() => {
  const { alertStore } = useStore();
  const [siinsTransactions, setSiinsTransactions] = useState<Siin[]>([]);
  const [siinExportnTransactions, setExportSiinsTransactions] = useState<
    Siin[]
  >([]);
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
  const [changedTransactionStatus, setChangedTransactionStatus] = useState("");

  const fetchSiinsData = async () => {
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
        alertStore.setAlert("warning", "Siins failed.");
      }
    } catch (error) {
      alertStore.setAlert("error", `Error copying to clipboard: ${error}`);
    }
  };

  const sendExportSiinsData = async (exportType: "pdf" | "csv" | "excel") => {
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
      const response = await fetch("/api/post-export-siin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          searchInput: searchQuery || "",
          createdDateRange,
          updatedDateRange,
        }),
      });

      if (response.ok) {
        const res = await response.json();

        const siinsData = res.siins;

        if (exportType === "excel") {
          exportExcelSiins(siinsData);
        } else if (exportType === "csv") {
          // exportSiinCSV(siinsData);
        } else if (exportType === "pdf") {
          // exportSiinPDF(siinsData);
        }
        alertStore.setAlert(
          "success",
          `Transactions data exported successfully!`,
        );
      } else {
        alertStore.setAlert("warning", "Transactions response failed.");
      }
    } catch (error) {
      alertStore.setAlert("error", `Oops! Something went wrong: ${error}`);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  useEffect(() => {
    fetchSiinsData();
  }, [
    searchQuery,
    limit,
    currentPage,
    selectedDateRange,
    changedTransactionStatus,
  ]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setLoading(false);
      setSearchQuery(inputSearchQueryValue);
    }, 1000);
    setLoading(true);
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

  const handleStatusChange = (status: string, txId: string) => {
    const updatedTransactions = siinsTransactions.map(record => {
      if (record.transaction.txId === txId) {
        return {
          ...record,
          transaction: { ...record.transaction, status }
        };
      }
      return record;
    });
  
    setSiinsTransactions(updatedTransactions);
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

        <ExportButton
          onSelect={(exportType: "pdf" | "csv" | "excel") => {
            sendExportSiinsData(exportType);
          }}
          disabled={loading}
        />
      </div>

      <div>
        <CustomSiinsTable
          data={siinsTransactions}
          columns={SiinsTableHeader}
          handleStatusChange={handleStatusChange}
          isLoading={loading}
        />

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
});

export default SiinsWrapper;
