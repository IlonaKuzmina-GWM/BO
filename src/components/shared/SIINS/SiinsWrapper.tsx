"use client";

import { useEffect, useState } from "react";

import { DateRange } from "react-day-picker";
import DatePickerWithRange from "../DatePickerWithRange";
import PaginationComponent from "../PaginationComponent";
import Search from "../Search";

import { SiinsTableHeader } from "@/constants/tableHeaders";
import { getStartDateForInterval } from "@/helpers/getStartDateForInterval";
import { getDateRanges } from "@/hooks/getDateRanges";
import { useStore } from "@/stores/StoreProvider";
import { Siin } from "@/types/siin";
import {
  exportExcelSiins,
  exportSiinCSV,
  exportSiinPDF,
} from "@/utils/export-utils";
import { observer } from "mobx-react-lite";
import DashIntervalSelect from "../DashIntervalSelect";
import DataLimitsSeter from "../DataLimitsSeter";
import ExportButton from "../ExportButton";
import CustomSiinsTable from "./CustomSiinsTable";

const SiinsWrapper = observer(() => {
  const { alertStore } = useStore();
  const [siinsTransactions, setSiinsTransactions] = useState<Siin[]>([]);
  // const [siinExportnTransactions, setExportSiinsTransactions] = useState<
  //   Siin[]
  // >([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState(true);

  const [inputSearchQueryValue, setInputSearchQueryValue] =
    useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [limit, setLimit] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [selectedCreatedInterval, setSelectedCreatedInterval] = useState("");
  const [selectedCreatedDateRange, setSelectedCreatedDateRange] = useState<
    DateRange | undefined
  >(undefined);

  const [selectedUpdatedInterval, setSelectedUpdatedInterval] = useState("");
  const [selectedUpdatedDateRange, setSelectedUpdatedDateRange] = useState<
    DateRange | undefined
  >(undefined);

  const [changedTransactionStatus, setChangedTransactionStatus] = useState("");

  const fetchSiinsData = async () => {
    setLoading(true);

    const { createdDateRange, updatedDateRange } = getDateRanges(
      selectedCreatedDateRange,
      selectedUpdatedDateRange,
    );

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
    } finally {
      setLoading(false);
    }
  };

  const sendExportSiinsData = async (exportType: "pdf" | "csv" | "excel") => {
    setLoading(true);

    const { createdDateRange, updatedDateRange } = getDateRanges(
      selectedCreatedDateRange,
      selectedUpdatedDateRange,
    );

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

        switch (exportType) {
          case "excel":
            exportExcelSiins(siinsData);
            break;
          case "csv":
            exportSiinCSV(siinsData);
            break;
          case "pdf":
            exportSiinPDF(siinsData);
            break;
          default:
            alertStore.setAlert(
              "warning",
              `Unknown export type: ${exportType}`,
            );
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSiinsData();
  }, [
    searchQuery,
    limit,
    currentPage,
    selectedCreatedDateRange,
    selectedUpdatedDateRange,
    changedTransactionStatus,
  ]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(inputSearchQueryValue);
    }, 1000);
    return () => clearTimeout(handler);
  }, [inputSearchQueryValue]);

  const handleSearchChange = (value: string) => {
    setInputSearchQueryValue(value);
  };

  const handleCreatedIntervalChange = (interval: string) => {
    setCurrentPage(1);

    setSelectedCreatedInterval(interval);
    setSelectedCreatedDateRange(undefined);

    setSelectedUpdatedInterval("");
    setSelectedUpdatedDateRange(undefined);

    const startDate = getStartDateForInterval(interval);
    const now = new Date();

    if (startDate) {
      setSelectedCreatedDateRange({ from: startDate, to: now });
    }
  };

  const handleCreatedDateRangeChange = (range: DateRange | undefined) => {
    setSelectedCreatedDateRange(range);
    setSelectedUpdatedDateRange(undefined);
    setSelectedCreatedInterval("");
  };

  const handleUpdatedIntervalChange = (interval: string) => {
    setCurrentPage(1);

    setSelectedUpdatedInterval(interval);
    setSelectedUpdatedDateRange(undefined);

    setSelectedCreatedInterval("");
    setSelectedCreatedDateRange(undefined);

    const startDate = getStartDateForInterval(interval);
    const now = new Date();

    if (startDate) {
      setSelectedUpdatedDateRange({ from: startDate, to: now });
    }
  };

  const handleUpdatedDateRangeChange = (range: DateRange | undefined) => {
    setSelectedUpdatedDateRange(range);
    setSelectedCreatedDateRange(undefined);
    setSelectedUpdatedInterval("");
  };

  const handleLimitChange = (limit: number) => {
    setLimit(limit);
  };

  const handleStatusChange = (status: string, txId: string) => {
    const updatedTransactions = siinsTransactions.map((record) => {
      if (record.transaction.txId === txId) {
        return {
          ...record,
          transaction: { ...record.transaction, status },
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

          <div className="flex">
            <DashIntervalSelect
              value={
                selectedCreatedInterval
                  ? selectedCreatedInterval
                  : "Created Interval"
              }
              label="No Interval"
              onIntervalChange={handleCreatedIntervalChange}
            />
            <DatePickerWithRange
              initialDate={selectedCreatedDateRange}
              onDateChange={handleCreatedDateRangeChange}
              name="Created date range"
            />
          </div>

          <div className="flex">
            <DashIntervalSelect
              value={
                selectedUpdatedInterval
                  ? selectedUpdatedInterval
                  : "Updated Interval"
              }
              label="No Interval"
              onIntervalChange={handleUpdatedIntervalChange}
            />
            <DatePickerWithRange
              initialDate={selectedUpdatedDateRange}
              onDateChange={handleUpdatedDateRangeChange}
              name="Updated date range"
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
